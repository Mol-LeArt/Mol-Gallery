import { useState, useEffect } from 'react';
import { projectFirestore } from '../firebase/config';

const useFirestore = (collection) => {
    const [docs, setDocs] = useState([]);

    useEffect(() => {
        const unsub = projectFirestore.collection(collection)
            .orderBy('createdAt', 'desc')
            .onSnapshot((snap) => {
                // console.log("snap in useFirestore " + snap);
                let documents = [];
                snap.forEach(doc => {
                    // console.log("doc.data w/out '...' - " + doc.data());
                    // console.log("doc.data w/ '...' - " + doc.id);
                    documents.push({ ...doc.data(), id: doc.id });
                })
                setDocs(documents);
            })
        // clean up function to stop useEffect (unsubscribe from listneing to the collection when imageGrid no longer needs updating) and avoid memory leak
        return () => unsub();
    }, [collection])

    return { docs };
}

export default useFirestore;
