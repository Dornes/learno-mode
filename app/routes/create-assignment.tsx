import { ActionFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { TitleInput } from "~/components/custom/form/title-input";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { createAssignmentAction } from "~/services/create-assignment-action";

export const action: ActionFunction = createAssignmentAction;

const CreateAssignment = () => {
  return (
    <div className="w-4/5 md:w-3/5 mx-auto mt-10 space-y-2">
      <Form method="post">
        <TitleInput
          name="assignmentTitle"
          maxLength={64}
          placeholder="Assignment title"
          defaultValue={"Untitled assignment"}
        />
        <Input
          name="assignmentDescription"
          placeholder="Assignment description"
        />
        <Button type="submit">Create</Button>
      </Form>
    </div>
  );
};

export default CreateAssignment;
