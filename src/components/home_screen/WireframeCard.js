import React from 'react';
import {getFirestore} from 'redux-firestore';

class WireframeCard extends React.Component {
    handleDeleteWireFrame=(e)=>{
        console.log('clicked!');
        e.preventDefault();
        if(window.confirm('Are you sure you want to delete this wireframe? This action cannot be undone!')){
            var firestore=getFirestore();
            firestore.collection('wireframes').doc(this.props.wireframe.id).delete();
        }
    }
    render() {
        const { wireframe } = this.props;
        console.log("WireframeCard, wireframe.id: " + wireframe.id);
        return (
            <div className="card z-depth-2 wireframe-list-link blue-grey darken-1 hoverable wireframe-card" style={{textAlign:'center'}}>
                <div className="card-content white-text text-darken-3 waves-effect waves-block waves-light z-depth-1 wireframe-card-text-container">
                    <span className="card-title">{wireframe.name}</span>
                    <i class="material-icons delete-wireframe text-darken-3" onClick={this.handleDeleteWireFrame}>remove_circle</i>
                    <i class='material-icons delete-wireframe-back'>fiber_manual_record</i>
                </div>
                
            </div>
        );
    }
}
export default WireframeCard;