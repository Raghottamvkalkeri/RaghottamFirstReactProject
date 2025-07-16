import { Client, Databases, ID, Query } from 'appwrite';
const DATABSE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
.setEndpoint('https://cloud.appwrite.io/v1')
.setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (SearchTerm , movie) => {
    // 1 Use the Appwrite SDK to search if  the search term already exists in the database
    try {
        const result = await database.listDocuments(DATABSE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', SearchTerm)
        ]);

        if(result.documents.length > 0 ){
            const doc = result.documents[0];

            await database.updateDocument(DATABSE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1
            });
        } else {
            await database.createDocument(DATABSE_ID, COLLECTION_ID , ID.unique(), {
                searchTerm: SearchTerm,
                count: 1,
                movie_id : movie.id,
                poster_url : `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            });
        }
    }
    catch (error) { 
        console.error('Error updating search count:', error);
    }
    // 2 If it exists, increment the count
    // 3 If does not exist, create a new document with the search term and count as 1

}

export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(DATABSE_ID , COLLECTION_ID , [
            Query.limit(5),
            Query.orderDesc('count')
        ])

        return result.documents;
    }
    catch (error) {
        console.error('Errot' , error);
    }
}