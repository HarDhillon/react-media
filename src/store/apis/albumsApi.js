import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { faker } from "@faker-js/faker";

const albumsApi = createApi({
    reducerPath: "albums",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3005",
    }),
    endpoints(builder) {
        return {
            removeAlbum: builder.mutation({
                invalidatesTags: (result, error, album) => {
                    return [{ type: "Album", id: album.id }];
                },
                query: (album) => {
                    return {
                        url: `/albums/${album.id}`,
                        method: "DELETE",
                    };
                },
            }),

            addAlbum: builder.mutation({
                invalidatesTags: (result, error, user) => {
                    return [{ type: "UsersAlbums", id: user.id }];
                },
                query: (user) => {
                    return {
                        url: "/albums",
                        method: "POST",
                        body: {
                            userId: user.id,
                            title: faker.commerce.productName(),
                        },
                    };
                },
            }),

            fetchAlbums: builder.query({
                // Tags are provided so we can determine when exactly we want to re-run something else.
                // We will want to re-run the fetch albums - but ONLY for the user that the album got added to. Or where album got deleted
                // The tag system ensures we only fetch data for the mutated user
                // If ANY tag gets invalidated we run the function
                providesTags: (result, error, user) => {
                    const tags = result.map((album) => {
                        return { type: "Album", id: album.id };
                    });

                    tags.push({ type: "UsersAlbums", id: user.id });
                    return tags;
                },
                query: (user) => {
                    return {
                        url: "/albums",
                        params: {
                            userId: user.id,
                        },
                        method: "GET",
                    };
                },
            }),
        };
    },
});

export const {
    useFetchAlbumsQuery,
    useAddAlbumMutation,
    useRemoveAlbumMutation,
} = albumsApi;
export { albumsApi };
