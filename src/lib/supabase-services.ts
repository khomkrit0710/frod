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
