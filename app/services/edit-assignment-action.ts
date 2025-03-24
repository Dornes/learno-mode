import { ActionFunction, redirect } from "@remix-run/node";
import { supabaseClient as supabase } from "~/auth/supabase.server";

const editAssignment = async (assignmentId: number, formData: FormData) => {
  const assignmentTitle = formData.get("assignmentTitle") as string;
  const assignmentDescription = formData.get("assignmentDescription") as string;
  const isControlGroup = formData.get("isControlGroup") === "on";
  const { error } = await supabase
    .from("assignments")
    .update({
      title: assignmentTitle,
      description: assignmentDescription,
      is_control_group: isControlGroup,
    })
    .eq("id", assignmentId);
  if (error) {
    throw new Error(`Error editing assignment: ${error.message}`);
  }
  return redirect(
    `/edit-assignment/${assignmentId}?message=Assignment successfully updated.`
  );
};

const createTask = async (assignmentId: number, formData: FormData) => {
  const taskTitle = formData.get("taskTitle") as string;
  const { error } = await supabase
    .from("tasks")
    .insert({
      title: taskTitle,
      assignment_id: assignmentId,
    })
    .single();
  if (error) {
    return Response.json({ error: "Failed to create task." }, { status: 400 });
  }
  return redirect(
    `/edit-assignment/${assignmentId}?message=Task successfully created.`
  );
};

const editTask = async (assignmentId: number, formData: FormData) => {
  const taskId = formData.get("taskId") as string;
  const taskTitle = formData.get("taskTitle") as string;
  const taskDescription = formData.get("taskDescription") as string;
  const testCode = formData.get("testCode") as string;
  const { error } = await supabase
    .from("tasks")
    .update({
      title: taskTitle,
      description: taskDescription,
      test_code: testCode,
    })
    .eq("id", taskId);
  if (error) {
    throw new Error(`Error editing task: ${error.message}`);
  }
  return redirect(
    `/edit-assignment/${assignmentId}?message=Task successfully updated.`
  );
};

const deleteTask = async (formData: FormData) => {
  const taskId = formData.get("taskId") as string;
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) {
    throw new Error(`Error deleting task: ${error.message}`);
  }
  return redirect(`./?message=Task successfully deleted.`);
};

const deleteAssignment = async (assignmentId: number) => {
  const { error } = await supabase
    .from("assignments")
    .delete()
    .eq("id", assignmentId);
  if (error) {
    throw new Error(`Error deleting assignment: ${error.message}`);
  }
  return redirect(`/admin/?message=Assignment successfully deleted.`);
};

export const editAssignmentAction: ActionFunction = async ({
  request,
  params,
}) => {
  const assignmentId = Number(params.assignmentId);
  if (isNaN(assignmentId)) {
    throw new Error("Invalid assignment ID:" + assignmentId);
  }
  const formData = await request.formData();
  const actionType = formData.get("action") as string;

  if (actionType === "editAssignment") {
    return editAssignment(assignmentId, formData);
  } else if (actionType === "createTask") {
    return createTask(assignmentId, formData);
  } else if (actionType === "editTask") {
    return editTask(assignmentId, formData);
  } else if (actionType === "deleteTask") {
    return deleteTask(formData);
  } else if (actionType === "deleteAssignment") {
    return deleteAssignment(assignmentId);
  }
};
