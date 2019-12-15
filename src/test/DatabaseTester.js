import React from 'react'
import { connect } from 'react-redux';
import wireframeJson from './TestWireFramData.json'
import { getFirestore } from 'redux-firestore';

class DatabaseTester extends React.Component {

    // NOTE, BY KEEPING THE DATABASE PUBLIC YOU CAN
    // DO THIS ANY TIME YOU LIKE WITHOUT HAVING
    // TO LOG IN
    handleClear = () => {
        if(this.props.firebase.profile.administrator!==undefined && this.props.firebase.profile.administrator){
            const fireStore = getFirestore();
            fireStore.collection('wireframes').get().then(function(querySnapshot){
                querySnapshot.forEach(function(doc) {
                    console.log("deleting " + doc.id);
                    fireStore.collection('wireframes').doc(doc.id).delete();
                })
            });
        }
    }

    handleReset = () => {
        if(this.props.firebase.profile.administrator!==undefined && this.props.firebase.profile.administrator){
            const fireStore = getFirestore();
            wireframeJson.wireFrames.forEach(wireframeJson => {
                fireStore.collection('wireframes').add({
                        name: wireframeJson.name,
                        wireframeWidth:wireframeJson.wireFrameWidth,
                        wireframeHeight:wireframeJson.wireFrameHeight,
                        controls:wireframeJson.controls,
                        userId:wireframeJson.userId,
                        created: Date.now()
                    }).then(() => {
                        console.log("DATABASE RESET");
                    }).catch((err) => {
                        console.log(err);
                    });
            });
        }
    }

    render() {
        return (
            <div>
                <button onClick={this.handleClear}>Clear Database</button>
                <button onClick={this.handleReset}>Reset Database</button>
            </div>)
    }
}

const mapStateToProps = function (state) {
    return {
        auth: state.firebase.auth,
        firebase: state.firebase
    };
}

export default connect(mapStateToProps)(DatabaseTester);