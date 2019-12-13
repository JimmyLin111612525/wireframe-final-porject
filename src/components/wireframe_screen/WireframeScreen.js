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
        props:null,
        selected:null,
        temp:null,
        transX:0,
        transY:0,
        index:null,
    }
    componentDidMount(){
        

        var firestore=getFirestore();
        firestore.collection('wireframes').doc(this.props.wireframe.id).update({created:Date.now()});
    }
    /*componentDidUpdate=()=>{
        for(var i=0;i<this.state.wireframe.controls.length;i++){
            var elms = document.querySelectorAll(`[id='w${this.state.wireframe.controls[i].key}']`);
            if(elms.length>1){
                for(var i = 0; i < elms.length-1; i++) 
                elms[i].style.display='none';
            }
        }
    }*/

    /*componentDidMount(){
        document.addEventListener('keydown',(e)=>{
            if(e.keyCode===46){
                this.deleteControl();
            }
            else if(e.keyCode===32){
                this.duplicateControl();
            }
        });

        var firestore=getFirestore();
        firestore.collection('wireframes').doc(this.props.wireframe.id).update({created:Date.now()});
    }*/

    fixedPosition=(index,left,top)=>{
        var wf=this.state.wireframe;
        var control=wf.controls[index-1];
        control.left=parseInt(control.left)-left;
        control.top=parseInt(control.top)-top;
        wf.controls[index-1]=control;
        this.setState({wireframe:wf});
    }

    handleTrans=(trans,index)=>{
        var translateRemoved=trans.substring(trans.indexOf('translate(')+10);
        var x=translateRemoved.substring(0,translateRemoved.indexOf('px'));
        var split=translateRemoved.split(', ');
        var y=split[1].substring(0,split[1].indexOf('px'));
        var wireframe=this.state.wireframe;
        console.log(translateRemoved);
        console.log(x);
        console.log(y);
        console.log(wireframe.controls[index-1]);
        var oLeft=parseInt(wireframe.controls[index-1].left);
        var oTop=parseInt(wireframe.controls[index-1].top);
        //var parsedX=parseInt(x)<0?0:parseInt(x);
        //var parsedY=parseInt(y)<0?0:parseInt(y);
        wireframe.controls[index-1].left=oLeft+parseInt(x);
        wireframe.controls[index-1].top=oTop+parseInt(y);
        //wireframe.controls[index-1].transX=x;
        //wireframe.controls[index-1].transY=y;
        wireframe.controls[index-1].transX=x;
        wireframe.controls[index-1].transY=y;
        this.setState({wireframe:wireframe,transX:x,transY:y});
        //this.fixedPosition(index,parseInt(x),parseInt(y));
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

    deleteControl=()=>{
        console.log('delete control');
        if(this.state.selected){
            var wireframe=this.state.wireframe;
            var index=wireframe.controls.indexOf(this.state.selected);
            delete wireframe.controls[index];
            this.setState({wireframe:wireframe,selected:null});
        }
        document.querySelector('.specific-props').innerHTML='';
    }

    getSelected=(control)=>{
        console.log('setting selected');
        console.log(this.state.wireframe.controls.indexOf(control));
        this.setState({selected:control,temp:control,index:this.state.wireframe.controls.indexOf(control)});
    }

    duplicateControl=()=>{
        console.log('duplicate control');
        if(this.state.selected){
            var wireframe=this.state.wireframe;
            var newControl=JSON.parse(JSON.stringify(this.state.selected));
            newControl.key=wireframe.controls.length+1;
            wireframe.controls.push(newControl);
            this.setState({wireframe:wireframe});
        }
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
        if(parseInt(this.state.height)>=1 && /^\d+$/.test(this.state.height) && parseInt(this.state.width)<=5000 && /^\d+$/.test(this.state.width)){
            var firestore=getFirestore();
            firestore.collection('wireframes').doc(this.props.wireframe.id).update({wireframeHeight:this.state.height,wireframeWidth:this.state.width});
        }
    }

    handleAddContainer=()=>{
        console.log('add container');
        var wireframe=this.state.wireframe;
        var addContainer={
            name:'addContainer',
            left:'0',
            top:'0',
            controlWidth:'100',
            controlHeight:'100',
            backgroundColor:'#ffffff',
            borderStyle:'solid',
            borderWidth:'4',
            borderColor:'#000000',
            borderRadius:'5',
            key:wireframe.controls.length+1,
            deleted:false,
            selected:false,
        }
        wireframe.controls.push(addContainer);
        this.setState({wireframe:wireframe});
    }

    handleAddButton=()=>{
        
        console.log('add button');
        var wireframe=this.state.wireframe;
        var addButton={
            name:'addButton',
            left:'0',
            top:'0',
            controlWidth:'80',
            controlHeight:'40',
            text:'button',
            fontSize:'10',
            backgroundColor:'#03fca1',
            borderStyle:'solid',
            borderWidth:'3',
            borderColor:'#ffffff',
            borderRadius:'5',
            color:'#000000',
            key:wireframe.controls.length+1,
            transX:'0',
            transY:'0',
            deleted:false,
            selected:true,
        }

        wireframe.controls.push(addButton);
        console.log(wireframe);
        this.setState({wireframe:wireframe});
    }

    //handleSave=()=>{
        //var wireframe=this.state.wireframe;
        /*for(var i=0;i<wireframe.controls.length;i++){
            wireframe.controls[i].left=wireframe.controls[i].transX;
            wireframe.controls[i].top=wireframe.controls[i].transY;
        }*/
        //var firestore=getFirestore();
        //firestore.collection('wireframes').doc(wireframe.id).update({controls:wireframe.controls});
        //console.log('save triggered. implement save you dumbass.')
    //}
    

    handleAddTextField=()=>{
        var wireframe=this.state.wireframe;
        var addTextField={
            name:'addTextField',
            left:'0',
            top:'0',
            controlWidth:'100',
            controlHeight:'20',
            text:'input',
            fontSize:'10',
            color:'#000000',
            backgroundColor:'#ffffff',
            key:wireframe.controls.length+1,
            transX:'0',
            transY:'0',
            deleted:false,
            selected:false,
        }
        wireframe.controls.push(addTextField);
        this.setState({wireframe:wireframe});
    }

    handleAddLabel=()=>{
        var wireframe=this.state.wireframe;
        var addLabel={
            name:'addLabel',
            left:0,
            top:0,
            fontSize:'10',
            controlWidth:'100',
            controlHeight:'20',
            text:'Label',
            color:'#000000',
            key:wireframe.controls.length+1,
            transX:'0',
            transY:'0',
            deleted:false,
            selected:false,
        }
        wireframe.controls.push(addLabel);
        this.setState({wireframe:wireframe});
    }

    handleZoomIn=()=>{
        console.log('zoom in');
    }

    render(){
        for(var i=0;i<this.state.wireframe.controls.length;i++){
            if(this.state.wireframe.controls.length>0){
                var elms = document.querySelectorAll(`[id='w${this.state.wireframe.controls[i].key}']`);
                if(elms.length>1){
                    for(var i = 0; i < elms.length-1; i++) 
                    elms[i].style.display='none';
                }
            }
        }
        
        const dragHandlers={onStart:this.onStart, onStop:this.onStop};
        const xCoord=this.state.xCoord;
        const yCoord=this.state.yCoord;

        var wireframeControls=this.props.wireframe.controls;

        if(this.state.close===true){
            this.setState({close:false});
            return <Redirect to='/'/>
        }

        var zoomStyle=null;
        return(
            
            <div>
                <div className="wireframe-name">
                    <span>Name:</span>
                    <input type='text' value={this.state.name} onChange={this.handleNameChange}/>
                </div>
                <div className='edit-container z-depth-3'>
                    <div className="zoom-container">
                        <i className="material-icons zoom-in waves-effect waves-light" onClick={this.handleZoomIn}>zoom_in</i>
                        <i className="material-icons zoom-out waves-effect waves-light">zoom_out</i>
                    </div>
                    <div className="properties-container">
                        <p className="properties-text">Properties</p>
                    </div>

                    <div className="properties-list">
                        <span>Width: </span>
                        <input type="text" class="width-textbox" value={this.state.width} onChange={this.handleChangeWidth}/>
                        <span>Height: </span>
                        <br></br>
                        <input type="text" class="height-textbox" value={this.state.height} onChange={this.handleChangeHeight}/>
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
                        <Wireframe index={this.state.index} handleTrans={this.handleTrans} selected={this.state.selected} getSelected={this.getSelected} duplicateControl={this.duplicateControl} deleteControl={this.deleteControl} width={this.props.wireframe.wireframeWidth} height={this.props.wireframe.wireframeHeight} wireframe={this.state.wireframe}>
                            
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
