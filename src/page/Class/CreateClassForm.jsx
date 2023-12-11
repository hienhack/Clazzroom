import {
  Card,
  CardBody,
  CardFooter,
  Input,
  Typography,
  Dialog,
  Button,
  Textarea,
} from "@material-tailwind/react";
import { useState } from "react";

function CreateClassForm({ onSuccess, open, handleOpen }) {
  const [class_name, setClassName] = useState('');
  const [room, setRoom] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(false);

  const handleCreate = () => {
    if (class_name.trim() === '') {
      setError(true);
    } else {
      setError(false);
      onSuccess({ class_name, room, topic, description });
    }
  };

  const handleInputChange = (e, setValue) => {
    setValue(e.target.value);
    setError(false);
  };

  return (
    <Dialog
      size="sm"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto p-2 w-full">
        <CardBody className="flex flex-col gap-4">
          <Typography className="mb-3" variant="h4" color="blue-gray">
            Create a new class
          </Typography>
          <div className="flex flex-col gap-6">
            <Input
              variant="standard"
              label="Class name *"
              size="lg"
              value={class_name}
              onChange={(e) => handleInputChange(e, setClassName)}
              error={error}
            />
            <Input
              variant="standard"
              label="Room"
              size="lg"
              value={room}
              onChange={(e) => handleInputChange(e, setRoom)}
            />
            <Input
              variant="standard"
              label="Topic"
              size="lg"
              value={topic}
              onChange={(e) => handleInputChange(e, setTopic)}
            />
            <Textarea
              variant="standard"
              label="Class description"
              value={description}
              onChange={(e) => handleInputChange(e, setDescription)}
            />
          </div>
          {error && (
            <span className="text-xs text-red-500">{"Class name is required"}</span>
          )}
        </CardBody>
        <CardFooter className="pt-0 mt-2">
          <div className="flex justify-end items-center gap-2">
            <Button
              size="sm"
              variant="text"
              color="red"
              onClick={handleOpen}
              className="normal-case rounded-md"
            >
              <span>Cancel</span>
            </Button>
            <Button
              className="normal-case rounded-md"
              size="sm"
              variant="gradient"
              color="blue"
              onClick={handleCreate}
            >
              <span>Create</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Dialog>
  );
}

export default CreateClassForm;
