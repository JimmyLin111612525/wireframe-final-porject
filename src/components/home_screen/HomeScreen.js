import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import {getFirestore} from 'redux-firestore';
import { firestoreConnect } from 'react-redux-firebase';
import {Modal,Button, Icon} from 'react-materialize';

import WireframeLinks from './WireframeLinks'
import { firestore } from 'firebase';

class HomeScreen extends Component {
    state={
        id:null
    }

    /*handleNewList=(e)=>{
        console.log(e.target);
        e.preventDefault();
        console.log('NEW LIST!!');
        var newList={
            items:[],
            name:'Unknown',
            owner:'Unknown',
            created:Date.now()
        }
        //var id;
        var fireStore=getFirestore();
        fireStore.collection('todoLists').add(newList).then(doc =>{
            this.setState({id:doc.id});
            newList.id=doc.id;
            this.props.dispatch(this.props.addList(newList));
        })

        //console.log(id);
    }*/

    handleNewWireframe=()=>{
        var newWireframe={
            name:'Unknown',
            created:Date.now(),
            wireframeWidth:700,
            wireframeHeight:500,
            controls:[]
        }

        var fireStore=getFirestore();
        fireStore.collection('wireframes').add(newWireframe).then(doc=>{
            this.setState({id:doc.id});
        })


    }

    render() {
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }
        if(this.state.id){
            console.log(this.state);
            return <Redirect to={`/wireframe/${this.state.id}`}/>
        }

        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m4">
                        <WireframeLinks />
                    </div>

                    <div className="col s8">
                        <div className="banner hoverable text-darken-5 z-depth-3">
                            
                            Wireframe Maker
                        </div>
                        
                        <div className="home_new_wireframe_container" style={{textAlign:'center',paddingTop:'20px'}}>
                                <Button className="home_new_wireframe_button btn-large pink lighten-2 waves-effect waves-block waves-light z-depth-2" style={{width:'60%',height:'25%', fontSize:'20px'}} onClick={this.handleNewWireframe}>
                                    Create a New Wireframe
                                </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    console.log(state);
    return {

        auth: state.firebase.auth
    };
};

export default compose(
    connect(mapStateToProps,{}),
    firestoreConnect([
      { collection: 'wireframes' },
    ]),
)(HomeScreen);