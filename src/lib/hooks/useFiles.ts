import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface FileResponse {
  id: string;
  name: string;
  url: string;
  fileData: ArrayBuffer;
  fileAudio: {
    id: string;
    url: string;
    status: string;
  };
  isLoading: boolean;
}

export function useFiles() {
  return useQuery<FileResponse[]>({
    queryKey: ["files"],
    queryFn: async () => {
      const response = await fetch("/api/files");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (files: { file: File; text: string }[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file.file);
        formData.append("text", file.text[0]);
      });

      const response = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileId: string) => {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}
