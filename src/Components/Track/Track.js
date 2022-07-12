import React from "react";
import './Track.css'

export class Track extends React.Component {
    constructor(props) {
        super(props);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }

    preview() {
        if(this.props.track.preview_url) {
            return (
                <audio controls className="audio">
                    <source src={this.props.track.preview_url} type="audio/mpeg"/>
                </audio>
            );
        } else {
            return <p className="prev">No preview available</p>
        }
    }
    
    renderAction() {
        if(this.props.isRemoval) {
            return <button className="Track-action" onClick={this.removeTrack}>-</button>;
        } else {
            return <button className="Track-action" onClick={this.addTrack}>+</button>;
        }
    }

    addTrack() {
        this.props.onAdd(this.props.track)
    }

    removeTrack() {
        this.props.onRemove(this.props.track)
    }

    render() {
        return (
            <div className="Track">
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <p>{this.props.track.artists[0].name} | {this.props.track.album.name}</p>
                   {this.preview()}
                </div>
                {this.renderAction()}
            </div>
        );
    }
}