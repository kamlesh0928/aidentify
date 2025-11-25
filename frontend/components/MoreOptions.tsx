"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { MoreHorizontal, Trash2, Loader2, AlertTriangle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SERVER_URL = process.env.NEXT_PUBLIC_NEXT_SERVER_URL;

export function MoreOptions() {
  const { user } = useUser();
  const { createNewChat, refreshChats } = useDashboard();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteAllChats = async () => {
    setIsDeleting(true);

    try {
      const email = user?.emailAddresses[0].emailAddress;

      await axios.delete(
        `${SERVER_URL}/api/chat/delete_all_chats?email=${email}`
      );

      createNewChat();
      refreshChats();

      toast.success("All chats deleted successfully");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete all chats: ", error);
      toast.error("Failed to delete chats");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More Options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => setIsDialogOpen(true)}
            className="text-red-500 hover:bg-red-500/10 cursor-pointer focus:text-red-500 focus:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span>Delete all chats</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Popup Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-5 w-5" />
              Delete all history?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all your chat history? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                deleteAllChats();
              }}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete All"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
