import * as React from "react";
import * as $ from "jquery";
import * as _ from "underscore";
import * as Promise from 'Promise';
import * as Moment from 'Moment';

import {Story} from '../constants/HackerNewsContants';
import {Author} from '../constants/HackerNewsContants';
import {StoryRow} from '../Components/StoryRow/StoryRow';

"use strict";

module HackerNewsPage {
    export interface State { 
        hackerNewsTopStoriesId?: number[];
        storyDetails?: Story[];
        authorDetails?: Author[];
    }
}

export class HackerNewsPage extends React.Component<{}, HackerNewsPage.State> {
    /**
     *   Represents the author names (ids) that need to be fetched, in order to display the needed data.
     *   Also used to save REST calls, in case we already have the author information.
     */
    private authorNamesToFetch: string[];
    /*
     *   Represents the story ids that need to be fetched, in order to display the needed data. 
     *   Also used for load more, keeping the stories which were already views so those will not be fecthed again.
     */
    private storiesIdsToFetch: number[];
    private static PAGE_SIZE: number = 10;

    constructor() {
        super();
        this.fetchStoryDetails = this.fetchStoryDetails.bind(this);
        this.fetchAuthorDetails = this.fetchAuthorDetails.bind(this);
        this.renderStoryRow = this.renderStoryRow.bind(this);
        this.onLoadMore = this.onLoadMore.bind(this);

        this.authorNamesToFetch = [];
        this.storiesIdsToFetch = [];

        this.state = {
            hackerNewsTopStoriesId: null,
            storyDetails: null
        };
    }

    //Lifecycle Methods
    public componentDidMount(): void {
        this.fetchTopStoriesIds();
    }

    //Event Handlers
    private onLoadMore(): void {
        this.removeFetchedStoriesFromTopStoriesIds();
        this.setState({
            storyDetails: null,
        })
        this.fetchAllStoryDetails(this.selectTenRandomStories());
    }

    //Helper Methods
    /**
     * Empty the stories to fetch, so that new stories can be selected for the next batch.
     */
    private removeFetchedStoriesFromTopStoriesIds(): void {        
        this.storiesIdsToFetch = [];
    }

    /**
     * As requested each time PAGE_SIZE random user stories are being selected from the top stories ids array.
     */
    private selectTenRandomStories(): number[] {
        let tempUserStoriesIds: number[] = [];

        //If there are not enough stories, do not attemp to select random stories as all are unique.  
        if (this.state.hackerNewsTopStoriesId.length <= HackerNewsPage.PAGE_SIZE) {
            this.storiesIdsToFetch = _.clone(this.state.hackerNewsTopStoriesId);
        } else {
            //Clone the current state, so that each selected story will be immediately removed and not selected twice.
            tempUserStoriesIds = _.clone(this.state.hackerNewsTopStoriesId);
            for (var i = 0; i < HackerNewsPage.PAGE_SIZE; i++) {
                let randomNum: number = tempUserStoriesIds[_.random(tempUserStoriesIds.length - 1)]
                //Maintain the next batch of stories to fetch
                this.storiesIdsToFetch.push(randomNum);
                //Make sure the story is removed from the current available story list
                tempUserStoriesIds = _.without(tempUserStoriesIds, randomNum);
            }
        }
        //Update the current state with the remaining stories
        this.setState({
            hackerNewsTopStoriesId: tempUserStoriesIds
        });
        return this.storiesIdsToFetch;
    }

    /**
     * Checking if an author was already fecthed, this makes sure that we save on rest calls if the inforation is already fetched.
     * @param authorName - author which was selected to be fetched.
     */
    private isAuthorFetched(authorName: string): boolean {
        return _.find(this.state.authorDetails, function(currentAuthor: Author): boolean {
            return currentAuthor.id === authorName;
        }) !== undefined;
    }

    /**
     * Find the author for which information is needed (used for render)
     * @param authorName - author to be found.
     */
    private getAuthorByName(authorName: string): Author {
        return _.find(this.state.authorDetails, function(currentAuthor: Author): boolean {
                return currentAuthor.id === authorName;
        });
    }

    /**
     * Checks if any of the information is missing or set to null. Usually this is part of the state (in many applications), in this case
     * I have selected to not manage this as part of the state. The reason for this is that managing this state wold require some checks
     * on the different fetch methods, this simplifies things a lot.
     */
    private isLoading(): boolean {
        return !this.state.storyDetails || !this.state.hackerNewsTopStoriesId || !this.state.authorDetails || this.authorNamesToFetch.length !== 0;
    }

    /**
     * Checks is the amount of stories left is more then PAGE_SIZE, as there is nothing more to load if there are no stories.
     */
    private canLoadMore(): boolean {
        return this.state.hackerNewsTopStoriesId && (this.state.hackerNewsTopStoriesId.length > 0);
    }

    //REST Calls
    private fetchAllAuthorDetails(): void {
        if (this.authorNamesToFetch.length === 0) {
            return;
        }
        Promise.all(this.authorNamesToFetch.map(this.fetchAuthorDetails))
        .then((authorDetails: Author[]) => {
            this.authorNamesToFetch = [];
            this.setState({
                authorDetails: _.union(this.state.authorDetails, authorDetails)
            });
        });
    }

    private fetchAllStoryDetails(storyIds: number[]): void {
        Promise.all(storyIds.map(this.fetchStoryDetails))
        .then((storiesDetails: Story[]) => {            
            storiesDetails = _.sortBy(storiesDetails, function (story: Story): number {
                return story.score
            });
            this.setState({
                storyDetails: storiesDetails
            });
            this.fetchAllAuthorDetails();
        });
    }

    private fetchAuthorDetails(authorName: string): any {
        return $.ajax({
            type: "GET",
            url: "https://hacker-news.firebaseio.com/v0/user/" + authorName + ".json",
            error: function (xhr, ajaxOptions, thrownError) {
                alert('Error occurred: ' + xhr.status + ' ' + thrownError);
            }
        });  
    }

    private fetchStoryDetails(storyId: number): any {
        return $.ajax({
            type: "GET",
            url: "https://hacker-news.firebaseio.com/v0/item/" + storyId + ".json",
            success: (response: Story) => {
                if (response && !this.isAuthorFetched(response.by)) {
                    this.authorNamesToFetch.push(response.by);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('Error occurred: ' + xhr.status + ' ' + thrownError);
            }
        });  
    }

    private fetchTopStoriesIds(): void {
        $.ajax({
            type: "GET",
            url: "https://hacker-news.firebaseio.com/v0/topstories.json",
            success: (response: number[]) => {
                this.setState({
                    hackerNewsTopStoriesId: response
                });
                this.fetchAllStoryDetails(this.selectTenRandomStories());
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('Error occurred: ' + xhr.status + ' ' + thrownError);
            }
        });
    }
  
    //Render Methods
    private renderLoader(): any {
        if (!this.isLoading()) {
            return;
        }
        return <div className="HackerNewsPage-Loading">
            Loading ...
        </div>
    }

    private renderLoadMore(): any {
        if (this.isLoading() || !this.canLoadMore()) {
            return;
        }
        return <button className="HackerNewsPage-LoadMore" onClick={this.onLoadMore}>
            Load More
        </button>
    }

    private renderStoryList(): any {
        if (this.isLoading()) {
            return;
        }
        return <ul className="HackerNewsPage-StoryList">
            {this.state.storyDetails.map(this.renderStoryRow)}
        </ul>;
    }

    private renderStoryRow(story: Story): any {
        return <StoryRow
            key={story.id}
            storyInformation = {story}
            authorInformation = {this.getAuthorByName(story.by)}
        />
    }

    private renderFinishReading(): any {
        if (this.isLoading() || this.canLoadMore()) {
            return;
        }
        return <h2 className="HackerNewsPage-NothingToLoad">
            No more stories for now, see you again tomorrow!
        </h2>
    }

    public render() {       
        return <div className="HackerNewsPage">
            <h1 className="HackerNewsPage-Title">Recent Hacker News</h1>          
            {this.renderLoadMore()}
            {this.renderLoader()}
            {this.renderStoryList()}
            {this.renderFinishReading()}
        </div>;
    }
}
