"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Plus, X, Save } from 'lucide-react';

import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface MediaGalleryProps {
  resources: Array<{ id: string }>
}

const MediaGallery = ({ resources }: MediaGalleryProps) => {
  const [selected, setSelected] = useState<Array<string>>([]);
  const [creation, setCreation] = useState();

  /**
   * handleOnClearSelection
   */

  function handleOnClearSelection() {
    setSelected([]);
  }

  /**
   * handleOnCreationOpenChange
   */

  function handleOnCreationOpenChange(isOpen: boolean) {
    if ( !isOpen ) {
      setCreation(undefined);
    }
  }

  return (
    <>
      {/** Popup modal used to preview and confirm new creations */}

      <Dialog open={!!creation} onOpenChange={handleOnCreationOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save your creation?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="justify-end sm:justify-end">
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save to Library
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/** Management navbar presented when assets are selected */}

      {selected.length > 0 && (
        <Container className="fixed z-50 top-0 left-0 w-full h-16 flex items-center justify-between gap-4 bg-white shadow-lg">
          <div className="flex items-center gap-4">
            <ul>
              <li>
                <Button variant="ghost" onClick={handleOnClearSelection}>
                  <X className="h-6 w-6" />
                  <span className="sr-only">Clear Selected</span>
                </Button>
              </li>
            </ul>
            <p>
              <span>{ selected?.length } Selected</span>
            </p>
          </div>
          <ul className="flex items-center gap-4">
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <Plus className="h-6 w-6" />
                    <span className="sr-only">Create New</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <span>Option</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </Container>
      )}

      {/** Gallery */}

      <Container>
        <form>
          {Array.isArray(resources) && (
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-12">
              {resources.map((resource) => {
                const isChecked = selected.includes(resource.id);

                function handleOnSelectResource(checked: boolean) {
                  setSelected((prev) => {
                    if ( checked ) {
                      return Array.from(new Set([...(prev || []), resource.id]));
                    } else {
                      return prev.filter((id) => id !== resource.id);
                    }
                  });
                }

                return (
                  <li key={resource.id} className="bg-white dark:bg-zinc-700">
                    <div className="relative group">
                      <label className={`absolute ${isChecked ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity top-3 left-3 p-1`} htmlFor={resource.id}>
                        <span className="sr-only">
                          Select Image &quot;{ resource.id }&quot;
                        </span>
                        <Checkbox
                          className={`w-6 h-6 rounded-full bg-white shadow ${isChecked ? 'border-blue-500' : 'border-zinc-200'}`}
                          id={resource.id}
                          onCheckedChange={handleOnSelectResource}
                          checked={isChecked}
                        />
                      </label>
                      <Link
                        className={`block cursor-pointer border-8 transition-[border] ${isChecked ? 'border-blue-500' : 'border-white'}`}
                        href="#"
                      >
                        <img
                          width="300"
                          height="300"
                          src="/icon-1024x1024.png"
                          alt="Cloudinary Logo"
                        />
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </form>
      </Container>
    </>
  )
}

export default MediaGallery;