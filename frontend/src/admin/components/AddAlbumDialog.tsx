import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const AddAlbumDialog = () => {
  interface NewAlbum {
    title: string;
    artist: string;
    releaseYear: string;
  }

  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newAlbum, setNewAlbum] = useState<NewAlbum>({
    title: "",
    artist: "",
    releaseYear: "",
  });

  const [files, setFiles] = useState<{
    image: File | null;
  }>({
    image: null,
  });

  const imageInputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (!files.image) {
        return toast.error("Please upload image files");
      }
      const formData = new FormData();
      formData.append("title", newAlbum.title);
      formData.append("artist", newAlbum.artist);
      formData.append("releaseYear", newAlbum.releaseYear);

      formData.append("imageFile", files.image);

      await axiosInstance.post("/admin/albums", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setNewAlbum({
        title: "",
        artist: "",
        releaseYear: "",
      });

      setFiles({
        image: null,
      });
      toast.success("Album added successfully");

      setAlbumDialogOpen(false);
    } catch (error: any) {
      toast.error("Error adding song", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-500 hover:bg-purple-600 text-black">
          <Plus className="mr-2 size-4" />
          Add Album
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
          <DialogDescription>Add a new song to your library</DialogDescription>
        </DialogHeader>

        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          hidden
          onChange={
            (e) => setFiles((prev) => ({ ...prev, image: e.target.files![0] })) // update state of image files
          }
        />

        {/* image upload area */}
        <div
          className="flex items-center justify-center p-6 border-2 
          border-dashed border-zinc-700 rounded-lg cursor-pointer "
          onClick={() => imageInputRef.current?.click()}
        >
          <div className="text-center">
            {files.image ? (
              <div className="space-y-2">
                <div className="text-sm text-emerald-500">Image selected:</div>
                <div className="text-xs text-zinc-400">
                  {files.image.name.slice(0, 20)}
                </div>
              </div>
            ) : (
              <>
                <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                  <Upload className="size-6 text-zinc-400" />
                </div>

                <div className="text-sm text-zinc-400 mb-2">Upload artwork</div>
                <Button variant={"outline"} size={"sm"} className="text-xs">
                  Choose File
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Other fields */}

        {/* new Song title */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            value={newAlbum.title}
            onChange={(e) =>
              setNewAlbum({ ...newAlbum, title: e.target.value })
            }
            className="bg-zinc-800 border-zinc-700"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Artist</label>
          <Input
            value={newAlbum.artist}
            onChange={(e) =>
              setNewAlbum({ ...newAlbum, artist: e.target.value })
            }
            className="bg-zinc-800 border-zinc-700"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Release Year</label>
          <Input
            value={newAlbum.releaseYear}
            onChange={(e) =>
              setNewAlbum({
                ...newAlbum,
                releaseYear: e.target.value,
              })
            }
            className="bg-zinc-800 border-zinc-700"
          />
        </div>

        <DialogFooter>
          <Button
            variant={"outline"}
            onClick={() => setAlbumDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-purple-500 hover:bg-purple-600"
          >
            {isLoading ? "Uploading..." : "Add Album"}{" "}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAlbumDialog;
