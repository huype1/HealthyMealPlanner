import {createClient} from '@supabase/supabase-js';
import {useAuthStore} from "../stores/index.js";

const supabase = createClient(
  'https://vnmkjmwfjyxglnnnhtws.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZubWtqbXdmanl4Z2xubm5odHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MjY4MzEsImV4cCI6MjA0NzQwMjgzMX0.1TJDHSoVh9QRtZV5SLhiE6uR9Ti85Eym8W9TzgTXtJE'
);

export const handleImageUpload = async (file, userId, folder='dishes' ) => {
  const fileName = `${userId}-${file.name}-${new Date().getTime()}`;
  const filePath = `${folder}/${fileName}`;
  // const oldImageUrl = supabase.storage
  //   .from("dish-images")
  //   .getPublicUrl(filePath);
  //
  // if (oldImageUrl.data.publicUrl) {
  //   await supabase.storage
  //    .from("dish-images")
  //    .remove([filePath]);
  // }
  const {data, error} = await supabase.storage
    .from("dish-images")
    .upload(filePath, file);
  if (error) {
    console.error(error)
    throw new Error("Failed to upload image");
  }
  const imageResult = supabase.storage
    .from("dish-images")
    .getPublicUrl(filePath);
  return imageResult.data.publicUrl;
};
