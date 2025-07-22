import { supabase } from './supabase'

// Types
export interface IntroSlide {
  id: number
  image_url: string
  image_path?: string
  created_at?: string
  updated_at?: string
}

export interface WebsiteImage {
  id: number
  image_type: 'logo' | 'footerLogo'
  image_url: string
  image_path?: string
  created_at?: string
  updated_at?: string
}

// Intro Slides Functions
export const introSlidesService = {
  // Get all slides
  async getAll(): Promise<IntroSlide[]> {
    const { data, error } = await supabase
      .from('intro_slides')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching intro slides:', error)
      throw error
    }

    return data || []
  },

  // Add new slide
  async create(imageUrl: string, imagePath?: string): Promise<IntroSlide> {
    const { data, error } = await supabase
      .from('intro_slides')
      .insert([{
        image_url: imageUrl,
        image_path: imagePath
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating intro slide:', error)
      throw error
    }

    return data
  },

  // Update slide
  async update(id: number, imageUrl: string, imagePath?: string): Promise<IntroSlide> {
    const { data, error } = await supabase
      .from('intro_slides')
      .update({
        image_url: imageUrl,
        image_path: imagePath,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating intro slide:', error)
      throw error
    }

    return data
  },

  // Delete slide
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('intro_slides')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting intro slide:', error)
      throw error
    }
  }
}

// Website Images Functions
export const websiteImagesService = {
  // Get all images
  async getAll(): Promise<WebsiteImage[]> {
    const { data, error } = await supabase
      .from('website_images')
      .select('*')
      .order('image_type', { ascending: true })

    if (error) {
      console.error('Error fetching website images:', error)
      throw error
    }

    return data || []
  },

  // Get image by type
  async getByType(imageType: 'logo' | 'footerLogo'): Promise<WebsiteImage | null> {
    const { data, error } = await supabase
      .from('website_images')
      .select('*')
      .eq('image_type', imageType)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching website image:', error)
      throw error
    }

    return data
  },

  // Update image
  async update(imageType: 'logo' | 'footerLogo', imageUrl: string, imagePath?: string): Promise<WebsiteImage> {
    const { data, error } = await supabase
      .from('website_images')
      .update({
        image_url: imageUrl,
        image_path: imagePath,
        updated_at: new Date().toISOString()
      })
      .eq('image_type', imageType)
      .select()
      .single()

    if (error) {
      console.error('Error updating website image:', error)
      throw error
    }

    return data
  }
}

// File Upload Functions
export const storageService = {
  // Upload file to Supabase Storage
  async uploadFile(file: File, folder: string = 'intro'): Promise<{ url: string; path: string }> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}.${fileExt}`

    const { error } = await supabase.storage
      .from('ford-images')
      .upload(fileName, file)

    if (error) {
      console.error('Error uploading file:', error)
      throw error
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('ford-images')
      .getPublicUrl(fileName)

    return {
      url: urlData.publicUrl,
      path: fileName
    }
  },

  // Delete file from Supabase Storage
  async deleteFile(filePath: string): Promise<void> {
    if (!filePath) return

    const { error } = await supabase.storage
      .from('ford-images')
      .remove([filePath])

    if (error) {
      console.error('Error deleting file:', error)
      throw error
    }
  },

  // Get public URL for a file
  getPublicUrl(filePath: string): string {
    const { data } = supabase.storage
      .from('ford-images')
      .getPublicUrl(filePath)

    return data.publicUrl
  }
}

// Types for Promotions
export interface Category {
  id: number
  name: string
}

export interface Promotion {
  id: number
  category_id: number
  image: string
  category?: Category
}

export interface PromotionWithCategory extends Promotion {
  category: Category
}

// Promotion Services
export const promotionService = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      throw error
    }

    return data || []
  },

  // Create new category
  async createCategory(name: string): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name }])
      .select()
      .single()

    if (error) {
      console.error('Error creating category:', error)
      throw error
    }

    return data
  },

  // Update category name
  async updateCategory(id: number, name: string): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update({ name })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating category:', error)
      throw error
    }

    return data
  },

  // Delete category and all its promotions
  async deleteCategory(id: number): Promise<void> {
    // First delete all promotions in this category
    await this.deletePromotionsByCategory(id)
    
    // Then delete the category
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  },

  // Get all promotions with categories
  async getPromotions(): Promise<PromotionWithCategory[]> {
    const { data, error } = await supabase
      .from('promotions')
      .select(`
        id,
        category_id,
        image,
        category:categories!inner(id, name)
      `)
      .order('id', { ascending: true })

    if (error) {
      console.error('Error fetching promotions:', error)
      throw error
    }

    // Transform the data to match our interface
    const transformedData = (data || []).map(item => ({
      ...item,
      category: Array.isArray(item.category) ? item.category[0] : item.category
    })) as PromotionWithCategory[]

    return transformedData
  },

  // Get promotions by category
  async getPromotionsByCategory(categoryId: number): Promise<Promotion[]> {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('category_id', categoryId)
      .order('id', { ascending: true })

    if (error) {
      console.error('Error fetching promotions by category:', error)
      throw error
    }

    return data || []
  },

  // Create new promotion
  async createPromotion(categoryId: number, imageUrl: string): Promise<Promotion> {
    // Generate a unique ID based on timestamp
    const id = Date.now()
    
    const { data, error } = await supabase
      .from('promotions')
      .insert([{
        id,
        category_id: categoryId,
        image: imageUrl
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating promotion:', error)
      throw error
    }

    return data
  },

  // Delete promotion
  async deletePromotion(id: number): Promise<void> {
    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting promotion:', error)
      throw error
    }
  },

  // Delete all promotions in a category
  async deletePromotionsByCategory(categoryId: number): Promise<void> {
    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('category_id', categoryId)

    if (error) {
      console.error('Error deleting promotions by category:', error)
      throw error
    }
  },

  // Upload promotion image
  async uploadImage(file: File): Promise<string> {
    const fileName = `promotion_${Date.now()}.${file.name.split('.').pop()}`
    const filePath = `promotions/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('promotions')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      throw uploadError
    }

    const { data } = supabase.storage
      .from('promotions')
      .getPublicUrl(filePath)

    return data.publicUrl
  },

  // Delete promotion image
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(imageUrl)
      const pathParts = url.pathname.split('/')
      const bucketIndex = pathParts.findIndex(part => part === 'promotions')
      
      if (bucketIndex === -1) {
        console.warn('Invalid image URL format:', imageUrl)
        return
      }

      const filePath = pathParts.slice(bucketIndex + 1).join('/')
      
      const { error } = await supabase.storage
        .from('promotions')
        .remove([filePath])

      if (error) {
        console.error('Error deleting image:', error)
        throw error
      }
    } catch (error) {
      console.error('Error parsing image URL:', error)
      // Don't throw error for URL parsing issues
    }
  }
}
