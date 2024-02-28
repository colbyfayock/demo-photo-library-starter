import MediaGallery from '@/components/MediaGallery';

export default async function Home() {
  return (
    <div className="h-full mt-6">
      <MediaGallery
        resources={[
          {
            id: 'my-image'
          }
        ]}
      />
    </div>
  )
}