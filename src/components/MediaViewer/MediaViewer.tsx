'use client';

import {  useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Blend, ChevronLeft, ChevronDown, Crop, Info, Pencil, Trash2, Wand2, Image, Ban } from 'lucide-react';

import Container from '@/components/Container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Deletion {
  state: string;
}

const MediaViewer = ({ resource }: { resource: { id: string; width: number; height: number; } }) => {
  const sheetFiltersRef = useRef<HTMLDivElement | null>(null);
  const sheetInfoRef = useRef<HTMLDivElement | null>(null);

  // Sheet / Dialog UI state, basically controlling keeping them open or closed

  const [filterSheetIsOpen, setFilterSheetIsOpen] = useState(false);
  const [infoSheetIsOpen, setInfoSheetIsOpen] = useState(false);
  const [deletion, setDeletion] = useState<Deletion>();

  // Canvas sizing based on the image dimensions. The tricky thing about
  // showing a single image in a space like this in a responsive way is trying
  // to take up as much room as possible without distorting it or upscaling
  // the image. Since we have the resource width and height, we can dynamically
  // determine whether it's landscape, portrait, or square, and change a little
  // CSS to make it appear centered and scalable!

  const canvasHeight = resource.height;
  const canvasWidth = resource.width;

  const isSquare = canvasHeight === canvasWidth;
  const isLandscape = canvasWidth > canvasHeight;
  const isPortrait = canvasHeight > canvasWidth;

  const imgStyles: Record<string, string | number> = {};

  if ( isLandscape ) {
    imgStyles.maxWidth = resource.width;
    imgStyles.width = '100%';
    imgStyles.height = 'auto';
  } else if ( isPortrait || isSquare ) {
    imgStyles.maxHeight = resource.height;
    imgStyles.height = '100vh';
    imgStyles.width = 'auto'
  }

  /**
   * closeMenus
   * @description Closes all panel menus and dialogs
   */

  function closeMenus() {
    setFilterSheetIsOpen(false)
    setInfoSheetIsOpen(false)
    setDeletion(undefined)
  }

  /**
   * handleOnDeletionOpenChange
   */

  function handleOnDeletionOpenChange(isOpen: boolean) {
    // Reset deletion dialog if the user is closing it
    if ( !isOpen ) {
      setDeletion(undefined);
    }
  }

  // Listen for clicks outside of the panel area and if determined
  // to be outside, close the panel. This is marked by using
  // a data attribute to provide an easy way to reference it on
  // multiple elements

  useEffect(() => {
    document.body.addEventListener('click', handleOnOutsideClick)
    return () => {
      document.body.removeEventListener('click', handleOnOutsideClick)
    }
  }, []);

  function handleOnOutsideClick(event: MouseEvent) {
    const excludedElements = Array.from(document.querySelectorAll('[data-exclude-close-on-click="true"]'));
    const clickedExcludedElement = excludedElements.filter(element => event.composedPath().includes(element)).length > 0;

    if ( !clickedExcludedElement ) {
      closeMenus();
    }
  }

  return (
    <div className="h-screen bg-black px-0">

      {/** Modal for deletion */}

      <Dialog open={!!deletion?.state} onOpenChange={handleOnDeletionOpenChange}>
        <DialogContent data-exclude-close-on-click={true}>
          <DialogHeader>
            <DialogTitle className="text-center">Are you sure you want to delete?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="justify-center sm:justify-center">
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/** Edit panel for transformations and filters */}

      <Sheet modal={false} open={filterSheetIsOpen}>
        <SheetContent
          ref={sheetFiltersRef}
          className="w-full sm:w-3/4 grid grid-rows-[1fr_auto] bg-zinc-800 text-white border-0"
          data-exclude-close-on-click={true}
        >
          <Tabs defaultValue="account">
            <TabsList className="grid grid-cols-3 w-full bg-transparent p-0">
              <TabsTrigger value="enhance">
                <Wand2 />
                <span className="sr-only">Enhance</span>
              </TabsTrigger>
              <TabsTrigger value="crop">
                <Crop />
                <span className="sr-only">Crop & Resize</span>
              </TabsTrigger>
              <TabsTrigger value="filters">
                <Blend />
                <span className="sr-only">Filters</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="enhance">
              <SheetHeader className="my-4">
                <SheetTitle className="text-zinc-400 text-sm font-semibold">Enhancements</SheetTitle>
              </SheetHeader>
              <ul className="grid gap-2">
                <li>
                  <Button variant="ghost" className={`text-left justify-start w-full h-14 border-4 bg-zinc-700 border-white`}>
                    <Ban className="w-5 h-5 mr-3" />
                    <span className="text-[1.01rem]">None</span>
                  </Button>
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="crop">
              <SheetHeader className="my-4">
                <SheetTitle className="text-zinc-400 text-sm font-semibold">Cropping & Resizing</SheetTitle>
              </SheetHeader>
              <ul className="grid gap-2">
                <li>
                  <Button variant="ghost" className={`text-left justify-start w-full h-14 border-4 bg-zinc-700 border-white`}>
                    <Image className="w-5 h-5 mr-3" />
                    <span className="text-[1.01rem]">Original</span>
                  </Button>
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="filters">
              <SheetHeader className="my-4">
                <SheetTitle className="text-zinc-400 text-sm font-semibold">Filters</SheetTitle>
              </SheetHeader>
              <ul className="grid grid-cols-2 gap-2">
                <li>
                  <button className={`w-full border-4 border-white`}>
                    <img
                      width={resource.width}
                      height={resource.height}
                      src="/icon-1024x1024.png"
                      alt="No Filter"
                    />
                  </button>
                </li>
              </ul>
            </TabsContent>
          </Tabs>
          <SheetFooter className="gap-2 sm:flex-col">
            <div className="grid grid-cols-[1fr_4rem] gap-2">
              <Button
                variant="ghost"
                className="w-full h-14 text-left justify-center items-center bg-blue-500"
              >
                <span className="text-[1.01rem]">
                  Save
                </span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full h-14 text-left justify-center items-center bg-blue-500"
                  >
                    <span className="sr-only">More Options</span>
                    <ChevronDown className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" data-exclude-close-on-click={true}>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <span>Save as Copy</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              variant="outline"
              className="w-full h-14 text-left justify-center items-center bg-transparent border-zinc-600"
              onClick={() => closeMenus()}
            >
              <span className="text-[1.01rem]">
                Close
              </span>
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/** Info panel for asset metadata */}

      <Sheet modal={false} open={infoSheetIsOpen}>
        <SheetContent
          ref={sheetInfoRef}
          className="w-full sm:w-3/4 grid grid-rows-[auto_1fr_auto] bg-zinc-800 text-white border-0"
          data-exclude-close-on-click={true}
        >
          <SheetHeader className="my-4">
            <SheetTitle className="text-zinc-200 font-semibold">Info</SheetTitle>
          </SheetHeader>
          <div>
            <ul>
              <li className="mb-3">
                <strong className="block text-xs font-normal text-zinc-400 mb-1">ID</strong>
                <span className="flex gap-4 items-center text-zinc-100">
                  { resource.id }
                </span>
              </li>
            </ul>
          </div>
          <SheetFooter>
            <Button
              variant="outline"
              className="w-full h-14 text-left justify-center items-center bg-transparent border-zinc-600"
              onClick={() => closeMenus()}
            >
              <span className="text-[1.01rem]">Close</span>
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/** Asset management navbar */}

      <Container className="fixed z-10 top-0 left-0 w-full h-16 flex items-center justify-between gap-4 bg-gradient-to-b from-black">
        <div className="flex items-center gap-4">
          <ul>
            <li>
              <Link href="/" className={`${buttonVariants({ variant: "ghost" })} text-white`}>
                <ChevronLeft className="h-6 w-6" />
                Back
              </Link>
            </li>
          </ul>
        </div>
        <ul className="flex items-center gap-4">
          <li>
            <Button variant="ghost" className="text-white" onClick={() => setFilterSheetIsOpen(true)}>
              <Pencil className="h-6 w-6" />
              <span className="sr-only">Edit</span>
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="text-white" onClick={() => setInfoSheetIsOpen(true)}>
              <Info className="h-6 w-6" />
              <span className="sr-only">Info</span>
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="text-white" onClick={() => setDeletion({ state: 'confirm' })}>
              <Trash2 className="h-6 w-6" />
              <span className="sr-only">Delete</span>
            </Button>
          </li>
        </ul>
      </Container>

      {/** Asset viewer */}

      <div className="relative flex justify-center items-center align-center w-full h-full">
        <img
          className="object-contain"
          width={resource.width}
          height={resource.height}
          src="/icon-1024x1024.png"
          alt="Cloudinary Logo"
          style={imgStyles}
        />
      </div>
    </div>
  )
};

export default MediaViewer;