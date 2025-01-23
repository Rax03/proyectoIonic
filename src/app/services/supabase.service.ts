import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;


  constructor() { 
    this.supabase = createClient(environment.supabaseConfig.projectURL, environment.supabaseConfig.apiKey);
  }
    async uploadImage(path: string, imageUrl: string) {
      const blob = this.dataUrlToBlob(imageUrl!);
      const file = new File([blob], path.split('/')[1] + `.png`, {
        type: 'image/png',
      });
  
      const uploadResult = await this.supabase.storage
        .from(environment.supabaseConfig.bucket)
        .upload(path, file, { upsert: true });
      if (uploadResult.error) {
        throw uploadResult.error;
      }
      const urlInfo = await this.supabase.storage
        .from(environment.supabaseConfig.bucket)
        .getPublicUrl(path);
      return urlInfo.data.publicUrl;
    }
  
    // Convertir dataUrl a Blob
    private dataUrlToBlob(dataUrl: string): Blob {
      const arr = dataUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)![1]; // Extraer el tipo MIME (por ejemplo, "image/jpeg")
      const bstr = atob(arr[1]); // Decodificar base64
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
  
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
  
      return new Blob([u8arr], { type: mime });
    }
}
