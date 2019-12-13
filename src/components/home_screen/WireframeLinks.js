import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WireframeCard from './WireframeCard';
//import {addLists,recentList} from '../../store/actions/actionCreators.js';

class WireframeLinks extends React.Component {

    state={
        wireframes:null
    }
    /*constructor(props){
        super(props);
    }*/
    setLists=(lists)=>{
        console.log(lists);
        this.props.addLists(lists);
    }

    /*handleRecentList=(e)=>{
        if(e.target.tagName==='SPAN'){
            var lstName=e.target.innerHTML;
            var todoLists=this.props.todoLists;
            var lst=null;
            console.log(todoLists);
            for(var i=0;i<todoLists.length;i++){
                if(todoLists[i].name===lstName){
                    lst=todoLists[i];
                    todoLists.splice(i,1);
                    break;
                }
            }
            console.log(lst);
            var newTodoLists=[lst,...todoLists];
            //console.log(newTodoLists);
            console.log(this.props.recentList(newTodoLists));
        }
    }*/

    render() {
        
        var wireframesOrig = this.props.wireframes;
        console.log(this.props.wireframes);
        /*if(this.state.todoLists!==null){
            todoLists=this.state.todoLists;
        }*/
        //this.setLists(todoLists);
        if(wireframesOrig!==undefined){
            var wireframes=wireframesOrig.filter(wf=>{if(wf.userId===this.props.userId){return wf}});
            wireframes.sort(function(a,b){
                console.log(a.created,b.created,typeof(a.created));
                if(a.created>b.created){
                    return -1;
                }
                if(a.created<b.created){
                    return 1;
                }
                else{
                    return 0;
                }
                
            })
        }
        //console.log(todoLists);
        return (
            <div className="wireframes section">
                {wireframes && wireframes.map(wireframe => (
                    <Link to={'/wireframe/' + wireframe.id} key={wireframe.id}>
                        <WireframeCard wireframe={wireframe} />
                    </Link>
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        wireframes: state.firestore.ordered.wireframes,
        auth: state.firebase.auth,
        userId: state.firebase.auth.uid,
    };
};

export default compose(connect(mapStateToProps,{}))(WireframeLinks);