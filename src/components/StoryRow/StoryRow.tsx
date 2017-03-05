import * as React from "react";
import * as $ from "jquery";
import * as _ from "underscore";
import * as Promise from 'Promise';
import * as Moment from 'Moment';

import {Story} from '../../constants/HackerNewsContants';
import {Author} from '../../constants/HackerNewsContants';

"use strict";

module StoryRow {
    export interface Props { 
        storyInformation: Story;
        authorInformation: Author;
    }
}

export class StoryRow extends React.Component<StoryRow.Props, {}> {
    constructor() {
        super();
    }
  
    //Render Methods
    private renderStoryTitle(): any {
        return <div className="StoryRow-Title">
                {this.props.storyInformation.title}
            </div>
    }

    private renderStoryInformation(): any {
        let date: string = Moment(this.props.storyInformation.time).toDate().toString();
        return <div className="StoryRow-Information">
            <div className="StoryRow-Information-Score">
                <label className="StoryRow-Information-Score-Title">Story Score: </label>
                <label className="StoryRow-Information-Score-Content">{this.props.storyInformation.score}</label>
            </div>
            {this.props.storyInformation.text ? 
                <div className="StoryRow-Information-Description">{this.props.storyInformation.text}</div> : 
                null}
            {this.props.storyInformation.url ? 
                <a href={this.props.storyInformation.url} className="StoryRow-Information-Url">Read more about this story</a> : 
                null}
            <div className="StoryRow-Information-Time">
                <label className="StoryRow-Information-Time-Title">Posted on: </label>
                <label className="StoryRow-Information-Time-Content">{date}</label>
            </div>
        </div>
    }

    private renderAuthorInformation(): any {
        if (!this.props.authorInformation) {
            return;
        }
        return <div className="StoryRow-Author">
            <label className="StoryRow-Author-Title">Story by: </label>
            <label className="StoryRow-Author-Name">
                {this.props.authorInformation.id}
            </label>
            <label className="StoryRow-Author-Karma">Karma: </label>
            <label className="StoryRow-Author-KarmaScore">
                {this.props.authorInformation.karma}
            </label>
        </div>
    }

    public render() {
        return <li className="StoryRow">
           {this.renderStoryTitle()}
           {this.renderStoryInformation()}
           {this.renderAuthorInformation()}
        </li>;
    }
}
