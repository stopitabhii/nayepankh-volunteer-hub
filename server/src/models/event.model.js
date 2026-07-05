import supabase from "../config/supabase.js";
import { ApiError } from "../utils/apiResponse.js";

const updateEventImage = async (eventId, imageUrl) => {
  const { data, error } = await supabase
    .from("events")
    .update({ image_url: imageUrl })
    .eq("id", eventId)
    .select("*")
    .single();

  if (error) {
    throw new ApiError(500, `Failed to update event image: ${error.message}`);
  }

  return data;
};

export { updateEventImage };