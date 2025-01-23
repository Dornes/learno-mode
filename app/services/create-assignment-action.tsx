import { ActionFunction, redirect } from "@remix-run/node";
import { supabaseClient as supabase } from "~/auth/supabase.server";

export const createAssignmentAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const assignmentTitle = formData.get("assignmentTitle") as string;
  const assignmentDescription = formData.get("assignmentDescription") as string;

  const { data: newAssignment, error } = await supabase
    .from("assignments")
    .insert({
      title: assignmentTitle,
      description: assignmentDescription,
    })
    .select("id")
    .single();
  if (error) {
    return Response.json(
      { error: "Failed to create assignment." },
      { status: 400 }
    );
  }
  return redirect(`/edit-assignment/${newAssignment.id}`);
};
