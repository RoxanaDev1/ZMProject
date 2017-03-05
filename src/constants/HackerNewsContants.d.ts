/**
 * Constan file that describes the rest response of Story and Author. 
 * This also gives much meaning in reading functions,components and params.
 */

declare module HackerNewsConstants {
    export interface Story { 
        by: string;
        descendants: number;
        id: number;
        kids: number[],
        score: number,
        text: string,
        time: number,
        title: string,
        type: string,
        url: string
    }

    export interface Author { 
        about?: string;
        created: number;
        id: string;
        karma: number,
        submitted: number[]
    }
}
export = HackerNewsConstants;