import { ActionFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import BackButton from "~/components/custom/back-button";
import { TitleInput } from "~/components/custom/form/title-input";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { createAssignmentAction } from "~/services/create-assignment-action";

export const action: ActionFunction = createAssignmentAction;

const CreateAssignment = () => {
  return (
    <div className="w-4/5 md:w-3/5 mx-auto mt-10 space-y-2">
      <BackButton to="/admin" />
      <Form method="post">
        <div className="mb-10 space-y-4">
          <TitleInput
            name="assignmentTitle"
            maxLength={64}
            placeholder="Assignment title"
          />
          <div className="space-y-1">
            <p className="text-gray-500 text-sm">Assignment description</p>
            <Input
              name="assignmentDescription"
              placeholder="Assignment description"
            />
          </div>
          <Button type="submit">Create assignment</Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateAssignment;
