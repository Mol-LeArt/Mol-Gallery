import { useState, useEffect } from 'react';
import { projectStorage, projectFirestore, timeStamp } from  '../firebase/config'

const useStorage = (metadata, file) => {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);
    
    useEffect(() => {
      // references
      const storageRef = projectStorage.ref(file.name);
      const collectionRef = projectFirestore.collection('nft');

      storageRef.put(file).on('state_changed', (snap) => {
        let percentage = (snap.bytesTransferred / snap.totalBytes) * 100
        setProgress(percentage);
      }, (err) => {
          setError(err);
      }, async () => {
        const url = await storageRef.getDownloadURL();
        const createdAt = timeStamp();
        const dict = { ...metadata, url: url, createdAt: createdAt }
        collectionRef.add(dict)
        setUrl(url);
      })
    }, [metadata, file])

    return { progress, url, error }
}

export default useStorage;
