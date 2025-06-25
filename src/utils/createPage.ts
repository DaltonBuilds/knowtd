import { nanoid } from "nanoid";
import { supabase } from "../supabaseClient";

export const createPage = async () => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw new Error(`Authentication error: ${userError.message}`);
    }

    const user = userData.user;
    if (!user) {
      throw new Error("Please login to proceed.");
    }

    const slug = nanoid();
    const page = {
      id: undefined,
      title: "Untitled",
      slug,
      nodes: [],
      createdBy: user.id,
    };

    const { error: insertError } = await supabase.from("pages").insert(page);

    if (insertError) {
      throw new Error(`Failed to create page: ${insertError.message}`);
    }

    const { data: pageData, error: selectError } = await supabase
      .from("pages")
      .select("id")
      .match({ slug, createdBy: user.id })
      .single();

    if (selectError) {
      throw new Error(
        `Failed to retrieve created page: ${selectError.message}`
      );
    }

    if (!pageData) {
      throw new Error("Page creation succeeded but retrieval failed");
    }

    return {
      ...page,
      id: pageData.id,
    };
  } catch (error) {
    console.error("Error in createPage:", error);
    throw new Error(
      `Page creation failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};
