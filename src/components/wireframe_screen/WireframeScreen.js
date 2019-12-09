import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import {Modal,Button, Icon} from 'react-materialize';
import Draggable from 'react-draggable';

import Wireframe from './Wireframe.js'

class WireframeScreen extends Component{
    state={
        name:this.props.wireframe.name,
        close:false,
        wireframe:this.props.wireframe,
        markup:null,
        propertiesMarkUp:null,
        height:this.props.wireframe.wireframeHeight,
        width:this.props.wireframe.wireframeWidth,
        props:null
    }
    componentDidMount(){
        var firestore=getFirestore();
        firestore.collection('wireframes').doc(this.props.wireframe.id).update({created:Date.now()});
    }

    handleCloseEditScreen=()=>{
        this.setState({close:true});
    }

    onStop=(e,ui)=>{
        console.log('you stopped dragging');
        var info=e.target.getBoundingClientRect();
        console.log(typeof(info.x));
        this.setState({xCoord:info.x});

    }

    handleAddContainer=()=>{

    }

    handleNameChange=(e)=>{
        this.setState({name:e.target.value});
        var name=(e.target.value.trim()===''?'Unknown':e.target.value.trim());
        var firestore=getFirestore();
        firestore.collection('wireframes').doc(this.props.wireframe.id).update({name:name});
    }

    handleChangeHeight=(e)=>{
        this.setState({height:e.target.value});
        
    }

    handleChangeWidth=(e)=>{
        this.setState({width:e.target.value});
        
    }

    submitDimChanges=()=>{
        var firestore=getFirestore();
        firestore.collection('wireframes').doc(this.props.wireframe.id).update({wireframeHeight:this.state.height,wireframeWidth:this.state.width});
    }

    handleAddButton=()=>{
        console.log('add button');
        var wireframe=this.state.wireframe;
        var addButton={
            name:'addButton',
            positionX:'400',
            positionY:'400',
            controlWidth:'80',
            controlHeight:'40',
            text:'button',
            fontSize:'10',
            backgroundColor:'#03fca1',
            key:wireframe.controls.length+1
        }
        wireframe.controls.push(addButton);
        console.log(wireframe);
        this.setState({wireframe:wireframe});
    }

    handleAddTextField=()=>{
        var wireframe=this.state.wireframe;
        var addTextField={
            name:'addTextField',
            right:'0',
            top:'0',
            controlWidth:'100',
            controlHeight:'20',
            text:'input',
            fontSize:'10',
            color:'#000000',
            backgroundColor:'#ffffff',
            key:wireframe.controls.length+1
        }
        wireframe.controls.push(addTextField);
        this.setState({wireframe:wireframe});
    }

    handleAddLabel=()=>{
        var wireframe=this.state.wireframe;
        var addLabel={
            name:'addLabel',
            positionX:'400',
            positionY:'400',
            fontSize:'10',
            controlWidth:'100',
            controlHeight:'20',
            text:'Label',
            color:'#000000',
            key:wireframe.controls.length+1
        }
        wireframe.controls.push(addLabel);
        this.setState({wireframe:wireframe});
    }

    render(){
        
        
        const dragHandlers={onStart:this.onStart, onStop:this.onStop};
        const xCoord=this.state.xCoord;
        const yCoord=this.state.yCoord;

        var wireframeControls=this.props.wireframe.controls;

        if(this.state.close===true){
            this.setState({close:false});
            return <Redirect to='/'/>
        }


        return(
            
            <div>
                <div className="wireframe-name">
                    <span>Name:</span>
                    <input type='text' value={this.state.name} onChange={this.handleNameChange}/>
                </div>
                <div className='edit-container z-depth-3'>
                    <div className="zoom-container">
                        <i className="material-icons zoom-in waves-effect waves-light">zoom_in</i>
                        <i className="material-icons zoom-out waves-effect waves-light">zoom_out</i>
                    </div>
                    <div className="properties-container">
                        <p className="properties-text">Properties</p>
                    </div>

                    <div className="properties-list">
                        <span>Width: </span>
                        <input type="text" class="width-textbox" pattern="[0-9]*" value={this.state.width} onChange={this.handleChangeWidth}/>
                        <span>Height: </span>
                        <br></br>
                        <input type="text" class="width-textbox" pattern="[0-9]*" value={this.state.height} onChange={this.handleChangeHeight}/>
                        <br></br>
                        <Button style={{width:'60%',height:'5%', fontSize:'10px'}} onClick={this.submitDimChanges}>Update Dimensions</Button>

                        <div className="specific-props">
                            
                        </div>
                    </div>

                    <div className="edit-save-close">
                        <Button className="save-button green hoverable" style={{fontSize:'7px',height:'15px'}}>
                        </Button>
                        <Button className="close-button red darken-2 hoverable" onClick={this.handleCloseEditScreen} style={{fontSize:'7px',height:'15px'}}>
                        </Button>
                    </div>
                    <div className='container-container z-depth-2 waves-effect waves-block waves-light z-depth-3' onClick={this.handleAddContainer}>
                        <i className='material-icons container-symbol'>crop_landscape</i>
                        <p className='add-container-text'>Add container</p>
                    </div>
                    <div className='add-label-container z-depth-2 waves-effect waves-block waves-light z-depth-3' onClick={this.handleAddLabel}>
                        <p className='add-label-prompt'>LABEL</p>
                        <p className='add-label-text'>Add label</p>

                    </div>
                    <div className="add-button-container z-depth-2 waves-effect waves-block waves-light z-depth-3" onClick={this.handleAddButton}>
                        <i className='material-icons button-symbol'>play_circle_filled</i>
                        <p className="add-button-text">Add button</p>
                    </div>
                    <div className="add-textfield-container z-depth-2 waves-effect waves-block waves-light z-depth-3" onClick={this.handleAddTextField}>
                        <i className="material-icons textfield-symbol">message</i>
                        <p className="add-textfield-text">Add textfield</p>
                    </div>
                    
                    <div className="active-screen" style={{textAlign:'center'}}>
                        <Wireframe width={this.props.wireframe.wireframeWidth} height={this.props.wireframe.wireframeHeight} wireframe={this.state.wireframe}>
                            
                        </Wireframe>
                    </div>
                </div>
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

  /*
  <Draggable bounds='parent' defaultPosition={{x:xCoord, y:yCoord}} {...dragHandlers}>

                                <p>you faggot!</p>
                            
                        </Draggable>
                        */


/*
{wireframeControls && wireframeControls.map(control=>{
                        if(control.name==='addContainer'){
                            var styling={
                                positionX:control.positionX,
                                positionY:control.positionY,
                                width:`${control.controlWidth}px`,
                                height:`${control.controlHeight}px`,
                                backgroundColor:'#a52a2a',
                                borderWidth:`${control.borderThickness}px`,
                                borderRadius:`${control.borderRadius}px`,
                                borderColor:'#000',
                                //textColor:control.textColor
                            }
                            return (
                            <div style={styling}>
                            </div>
                            )
                        }
                    })}
*/
