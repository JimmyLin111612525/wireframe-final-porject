import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';

class WireframeScreen extends Component{
    componentDidMount(){
        var firestore=getFirestore();
        firestore.collection('wireframes').doc(this.props.wireframe.id).update({created:Date.now()});
    }

    render(){
        
        return(
            <div>
                <p>Hello!</p>
            </div>
        )
    }
}

const mapStateToProps=(state,ownProps)=>{
    const{id}=ownProps.match.params;
    console.log(state.firestore.data);
    const{wireframes}=state.firestore.data;
    const wireframe=wireframes?wireframes[id]:null;
    wireframe.id=id;
    

    return{
        wireframes,
        wireframe,
        auth:state.firebase.auth,
    }
}

export default compose(
    connect(mapStateToProps,{}),
    firestoreConnect([
      { collection: 'wireframes' },
    ]),
  )(WireframeScreen);