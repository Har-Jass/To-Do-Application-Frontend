import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import styles from "./ToDoList.module.css"
// import { Button, Divider, Input, Modal, message } from 'antd'
import { Button, Divider, Empty, Input, Modal, Select, Tag, Tooltip, message } from 'antd';
import {getErrorMessage} from '../../util/GetError';
import { getUserDetails } from '../../util/GetUser';
import ToDoServices from '../../services/toDoServices';
import { useNavigate } from 'react-router';

import { CheckCircleFilled, CheckCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

function ToDoList() {
  // these 2 state variables store the value of the tasks that user entered
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // this state variable is basically a flag, which keeps track that user has clicked on Add Task Button or not
  // if clicked, isAdding value is true, else false
  const [isAdding, setIsAdding] = useState(false);

  // this state variable will handle the loading part
  const [loading,setLoading] = useState(false);

  // this state variable is to store all the todo tasks of the current logged in user
  const [allToDo, setAllToDo] = useState([]);

  // creating a navigate object using the useNavigate() hook
  // this object allow us to change the route
  const navigate = useNavigate();

  const [currentEditItem, setCurrentEditItem] = useState("");

  // this state variable is for opening the edit task modal
  // if its true then modal will open, else modal will close
  const [isEditing, setIsEditing] = useState(false);

  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");

  // this state variable will help us to make the Dropdown, so that we can se Completed, Incompleted Task
  const [currentTaskType, setCurrentTaskType] = useState("incomplete");
  const [completedTodo, setCompletedTodo] = useState([]);
  const [incompletedTodo, setIncompletedTodo] = useState([]);
  const [currentTodoTask, setCurrentToDoTask] = useState([]);

  // we store our search results in this filteredToDo state variable, after finding the task in the allToDo list
  const [filteredToDo, setFilteredToDo] = useState([]);

  // this function will fetch all the todo tasks of the current logged in user
  const getAllToDo = async() => {
    try {
      // fetching user from the local storage
      let user = getUserDetails();

      // first fetching the userId and then fetching all the todo tasks of the current fetched user
      const userId = user?.finalData?.userId;
      const response = await ToDoServices.getAllToDo(userId);

      // finally we store all the todo tasks of the user into the allToDo variable, using setAllToDo method
      setAllToDo(response.data);
    }
    catch(err) {
      message.error(getErrorMessage(err));
    }
  }

  // on first render we want to fetch all the available tasks of the current logged in user, so we use useEffect Hook
  useEffect(() => {
    // fetching user from the local storage
    let user = getUserDetails();

    const getAllToDo = async ()=>{
      try {
        const response = await ToDoServices.getAllToDo(user?.finalData?.userId);
        setAllToDo(response.data);
      }
      catch(err) {
        // console.log(err);
        message.error(getErrorMessage(err));
      }
    }

    // if we found user and user has userId
    // then we call the function which fetch all the todo tasks of the user
    if(user && user?.finalData?.userId) {
      getAllToDo();
    }
    // else if the user details is not there or the user id is not there
    // in that case we redirect the user to login page
    else {
      navigate('/');
    }
  }, [navigate]);


  useEffect(() => {
    const incomplete = allToDo.filter((item) => item.isCompleted === false);
    const complete = allToDo.filter((item) => item.isCompleted === true);
    setIncompletedTodo(incomplete);
    setCompletedTodo(complete);
    if(currentTaskType === 'incomplete') {
      setCurrentToDoTask(incomplete);
    }
    else {
      setCurrentToDoTask(complete);
    }
  }, [allToDo, currentTaskType])

  // this function formats the date and return the final formatted date
  const getFormattedDate = (value) => {
    let  date = new Date(value);
    let dateString = date.toDateString();
    let hh = date.getHours();
    let min = date.getMinutes();
    let ss = date.getSeconds();
    let finalDate = `${dateString} at ${hh}:${min}:${ss}`;
    return finalDate;
  }

  // when the user clicks on ok button on the modal
  // this function is called, and specified tasks will run
  const handleSubmitTask = async() => {
    // step 1 -> set loading to true
    setLoading(true);

    try {
      // step 2 -> fetching user id from the local storage
      const userId = getUserDetails()?.finalData?.userId;

      // step 3 -> fetching the data of the task
      const data = { title, description, isCompleted: false, createdBy: userId };
      
      // step 4 -> send the data to the backend service
      await ToDoServices.createToDo(data);
      // const response = await ToDoServices.createToDo(data);

      // printing the response
      // console.log(response.data);

      // step 5 -> after receiving the response successfully, set loading to false
      setLoading(false);

      // step 6 -> send the success message in response
      message.success("Task Added Successfully!");

      // step 7 -> after added the task successfully, we close the modal
      setIsAdding(false);

      // step 8 -> after adding the task, we again call the getAllToDo() function
      // and show the user so that he can see his updated todo tasks
      getAllToDo();
    }
    catch(err) {
      // console.log(err);

      // if there is any error then also set loading to false
      setLoading(false);
      message.error(getErrorMessage(err));
    }
  }

  // this function will run when the user clicks on the edit icon of the specific task
  const handleEdit = (item) =>{
    // console.log("Aap aaye hai Edit krne -> ");
    // console.log(item);

    // setIsEditing true means this will open the edit modal on the screen
    setIsEditing(true);

    // this variable set the current item editable
    setCurrentEditItem(item);

    // below 3 state variables will show the current values of the tasks on the update modal
    setUpdatedTitle(item?.title);
    setUpdatedDescription(item?.description);
    setUpdatedStatus(item?.isCompleted);
  };

  // this function will run when the user clicks on the delete icon of the specific task
  const handleDelete = async(item) => {
    try {
      // when user wants to delete a task, we call the delete todo api from the backend
      await ToDoServices.deleteToDo(item._id);
      // const response = await ToDoServices.deleteToDo(item._id);
      // console.log(response.data);

      // then we show the message to the user that task is deleted successfully
      message.success(`${item.title} Deleted Successfully!`);

      // after deleting the task, we again call the getAllToDo() function
      // and show the user his updated todo tasks
      getAllToDo();
    }
    catch(err) {
      // console.log(err);
      message.error(getErrorMessage(err));
    }
  }

  // on every task we have the icon which shows that the task is completed or not
  // so if the task is not completed and user clicks on the task, the task will be marked as completed and vice versa
  // this function will be called when user clicks on that icon
  const handleUpdateStatus = async(id, status) => {
    try {
      // const response = await ToDoServices.updateToDo(id, {isCompleted: status});
      // console.log(response.data);
      await ToDoServices.updateToDo(id, {isCompleted: status});
      message.success("Task Status Updated Successfully!");
      getAllToDo();
    }
    catch(err) {
      // console.log(err);
      message.error(getErrorMessage(err));
    }
  }

  // when the user clicks on the ok button on update task modal
  // then this function will executed
  const handleUpdateTask = async() => {
    try {
      setLoading(true);

      const data = {
        title: updatedTitle,
        description: updatedDescription,
        isCompleted: updatedStatus
      };
      
      // here we call the backend API to update the task and we are passing the current items id and the updated data
      // const response = await ToDoServices.updateToDo(currentEditItem?._id, data);
      // console.log(response.data);
      await ToDoServices.updateToDo(currentEditItem?._id, data);

      // showing the success message to the user that the task is updated
      message.success(`${currentEditItem?.title} Updated Successfully!`);

      setLoading(false);

      // after updating the task we close the modal
      setIsEditing(false);

      // after deleting the task, we again call the getAllToDo() function
      // and show the user his updated todo tasks
      getAllToDo();
    }
    catch(err) {
      // console.log(err);
      setLoading(false);
      message.error(getErrorMessage(err));
    }
  }

  const handleTypeChange = (value) => {
    setCurrentTaskType(value);

    if(value === 'incomplete') {
      setCurrentToDoTask(incompletedTodo);
    }
    else {
      setCurrentToDoTask(completedTodo);
    }
  }

  // when the user search the task in the search box, this function will be executed
  const handleSearch = (e) => {
    // here we are fetching the task which user want to search from the search box
    let query = e.target.value;

    // here we filter the searched task from the all todo list
    let filteredList = allToDo.filter((item) => item.title.toLowerCase().match(query.toLowerCase()));
    if(filteredList.length > 0 && query){
      setFilteredToDo(filteredList);
    }
    else{
      setFilteredToDo([]);
    }
  }

  return (
    <>
      <Navbar active={"myTask"} />

      <section className={styles.toDoWrapper}>
        {/* this div contains title, input field where user can search their tasks, buttons from which user can add new task */}
        {/* when the user clicks on Add Task Button, the module will pop up and user can enter the details of the new task in that module */}
        <div className={styles.toDoHeader}>
          <h2>Your Tasks</h2>
          <Input style={{width:'50%'}} onChange={handleSearch} placeholder='Search Your Tasks Here' />
          <div>
            <Button type="primary" size="large" onClick={() => setIsAdding(true)}>
              Add Task
            </Button>

            <Select
                value={currentTaskType}
                style={{width:180, marginLeft:'10px'}}
                onChange={handleTypeChange}
                size="large"
                options={[
                  {
                    value:"incomplete",
                    label:'Incomplete'
                  },
                  {
                    value:"complete",
                    label:'Complete'
                  }
                ]}
            />
          </div>
        </div>

        {/* adding a divider, i.e., horizontal line */}
        <Divider />

        {/* creating the card for each todo task */}
        <div className={styles.toDoListCardWrapper}>
          {/* we run a map function on all fetched todo tasks, and create each card for each task */}
          {
            filteredToDo.length > 0 ? filteredToDo.map((item) => {
              return (
                <div key={item?._id} className={styles.toDoCard}>
                  {/* this div shows the title, other details and description of the todo task */}
                  <div>
                    <div className={styles.toDoCardHeader}>
                      {/* showing title of the task */}
                      <h3>
                        {
                          item?.title
                        }
                      </h3>

                      {/* showing that the task is completed or incomplete yet, if its completed then we show it in cyan color, if its incomplete then we show it in red color */}
                      {
                        item?.isCompleted ? <Tag color="cyan">Completed</Tag> : <Tag color="red">Incomplete</Tag>
                      }
                    </div>

                    {/* showing description of the task */}
                    <p>
                      {
                        item?.description
                      }
                    </p>
                  </div>
                  
                  {/* this div shows date of the task, edit task icon, delete task icon, and complete incomplete task icon */}
                  <div className={styles.toDoCardFooter}>
                    {/* here we show the date at which the task is created */}
                    <Tag>
                      {
                        getFormattedDate(item?.createdAt)
                      }
                    </Tag>
                    
                    {/* this div shows edit task icon, delete task icon and complete incomplete task icon */}
                    <div className={styles.toDoFooterAction}>
                      {/* edit task icon */}
                      <Tooltip title="Edit Task" placement='bottom'><EditOutlined onClick={()=>handleEdit(item)} className={styles.actionIcon} /></Tooltip>

                      {/* delete task icon */}
                      <Tooltip title="Delete Task" placement='bottom'><DeleteOutlined onClick={()=>handleDelete(item)} style={{color:'red'}} className={styles.actionIcon}/></Tooltip>

                      {/* complete incomplete task icon */}
                      {
                        item?.isCompleted 
                        ? 
                          <Tooltip title="Mark as Incomplete"><CheckCircleFilled onClick={()=>handleUpdateStatus(item._id,false)} style={{color:'green'}}  className={styles.actionIcon} /></Tooltip> 
                        :
                        <Tooltip title="Mark as Completed"><CheckCircleOutlined onClick={()=>handleUpdateStatus(item._id,true)}  className={styles.actionIcon}/></Tooltip>
                      }
                    </div>  
                  </div>
                </div>
              )
            }) :  currentTodoTask.length > 0 ? currentTodoTask.map((item) => {
              return (
                <div key={item?._id} className={styles.toDoCard}>
                  {/* this div shows the title, other details and description of the todo task */}
                  <div>
                    <div className={styles.toDoCardHeader}>
                      {/* showing title of the task */}
                      <h3>
                        {
                          item?.title
                        }
                      </h3>

                      {/* showing that the task is completed or incomplete yet, if its completed then we show it in cyan color, if its incomplete then we show it in red color */}
                      {
                        item?.isCompleted ? <Tag color="cyan">Completed</Tag> : <Tag color="red">Incomplete</Tag>
                      }
                    </div>

                    {/* showing description of the task */}
                    <p>
                      {
                        item?.description
                      }
                    </p>
                  </div>
                  
                  {/* this div shows date of the task, edit task icon, delete task icon, and complete incomplete task icon */}
                  <div className={styles.toDoCardFooter}>
                    {/* here we show the date at which the task is created */}
                    <Tag>
                      {
                        getFormattedDate(item?.createdAt)
                      }
                    </Tag>
                    
                    {/* this div shows edit task icon, delete task icon and complete incomplete task icon */}
                    <div className={styles.toDoFooterAction}>
                      {/* edit task icon */}
                      <Tooltip title="Edit Task" placement='bottom'><EditOutlined onClick={()=>handleEdit(item)} className={styles.actionIcon} /></Tooltip>

                      {/* delete task icon */}
                      <Tooltip title="Delete Task" placement='bottom'><DeleteOutlined onClick={()=>handleDelete(item)} style={{color:'red'}} className={styles.actionIcon}/></Tooltip>

                      {/* complete incomplete task icon */}
                      {
                        item?.isCompleted 
                        ? 
                          <Tooltip title="Mark as Incomplete"><CheckCircleFilled onClick={()=>handleUpdateStatus(item._id,false)} style={{color:'green'}}  className={styles.actionIcon} /></Tooltip> 
                        :
                        <Tooltip title="Mark as Completed"><CheckCircleOutlined onClick={()=>handleUpdateStatus(item._id,true)}  className={styles.actionIcon}/></Tooltip>
                      }
                    </div>  
                  </div>
                </div>
              )
            }) : <div className={styles.noTaskWrapper}>
                  <Empty />
                 </div> 
          }
        </div>

        {/* we are using the modal from ant design library */}
        {/* when someone clicks on cancel button in the modal then value of isAdding variable will set to false, and the modal will disappear */}
        {/* when someone clicks on ok button in the modal then handleSubmitTask function will call and do the specified operations */}
        {/* confirmLoading will show the loading spinner, if our loading value is set to true */}
        {/* title will set the title of the modal */}
        {/* when isAdding variable is true, means the user want to add new task, then this modal will open */}
        <Modal confirmLoading={loading} title="Add New Task" open={isAdding} onOk={handleSubmitTask} onCancel={() => setIsAdding(false)}>
          <Input style={{marginBottom:'1rem'}} placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input.TextArea placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} />
        </Modal>
        
        {/* suppose when the user click on the edit task icon on some task */}
        {/* then new modal will open on which the user can edit the details of the task */}
        <Modal confirmLoading={loading} title={`Update ${currentEditItem.title}`} open={isEditing} onOk={handleUpdateTask} onCancel={()=>setIsEditing(false)}>
          <Input style={{marginBottom:'1rem'}} placeholder='Updated Title' value={updatedTitle} onChange={(e)=>setUpdatedTitle(e.target.value)} />
          <Input.TextArea style={{marginBottom:'1rem'}} placeholder='Updated Description' value={updatedDescription} onChange={(e)=>setUpdatedDescription(e.target.value)} />
          <Select
            onChange={(value) => setUpdatedStatus(value)}
            value={updatedStatus}
            options={[
              {
                value: false,
                label: 'Not Completed',
              },
              {
                value: true,
                label: 'Completed',
              }
            ]}
          />
        </Modal>
      </section>
    </>
  )
}

export default ToDoList