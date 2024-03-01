import MediaViewer from '@/components/MediaViewer';

async function Resource() {
  return (
    <MediaViewer
      resource={{
        id: 'my-image',
        width: 1024,
        height: 1024
      }}
    />
  );
}

export default Resource;