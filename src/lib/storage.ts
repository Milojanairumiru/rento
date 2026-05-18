import { supabase, isSupabaseConfigured } from './supabase'

const BUCKET = 'vehicle-images'

/**
 * Upload vehicle images to Supabase Storage.
 * Files are stored under: vehicle-images/{userId}/{timestamp}-{filename}
 */
export async function uploadVehicleImages(
  userId: string,
  files: File[]
): Promise<{ urls: string[]; error: string | null }> {
  if (!isSupabaseConfigured()) {
    // Return placeholder URLs for mock mode
    return {
      urls: files.map(() => 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'),
      error: null,
    }
  }

  const urls: string[] = []

  for (const file of files) {
    const ext = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error)
      return { urls: [], error: `Failed to upload ${file.name}: ${error.message}` }
    }

    const { data: publicUrl } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName)

    urls.push(publicUrl.publicUrl)
  }

  return { urls, error: null }
}

/**
 * Delete a vehicle image from storage
 */
export async function deleteVehicleImage(imageUrl: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: null }

  // Extract path from full URL
  const path = imageUrl.split(`${BUCKET}/`)[1]
  if (!path) return { error: 'Invalid image URL' }

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([path])

  return { error: error?.message || null }
}
