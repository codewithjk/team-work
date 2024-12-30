import React from 'react'
import { useTheme } from './ui/theme-provider';
import { useState } from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';
import RichTextEditor from './RichTextEditor';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useEffect } from 'react';
import commentApi from '../../infrastructure/api/commentApi';
import { useSelector } from 'react-redux';
import moment from "moment/moment";
import { LucidePencil } from 'lucide-react';
import ConfirmationPopover from './ui/conformationPopover';

function TaskDetailedView({ task }) {
    const { profileData } = useSelector((state) => state.profile);
    console.log(profileData)
    const startDate = convertDate(task?.startDate)
    const endDate = convertDate(task?.endDate)
    const [comments, setComments] = useState([]);
    const [showCommentInput, setShowCommentInput] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [selectedComment, setSelctedComment] = useState(null);
  const [deletePopup,setDeletePopup] = useState(false)




    useEffect(() => {
        const fetchComments = async () => {
            let response = await commentApi.getAllComments(task._id);
            console.log(response.data)
            const { comments, totalPages, currentPage } = response.data;
            setComments(comments)     
        }
       fetchComments()
       
    }, []);
    console.log(comments)

  const handleAddComment = async() => {
      if (newComment) {
          console.log(newComment)
          // let comment = {
          //     content: newComment,
          //     author: profileData
          // }

          //TODO : add author from profile data and send to comment api 
        let response = await commentApi.createComment(task._id, {content:newComment})
        let { comment } = response.data;

      setComments([
        
        { _id: comment._id, content: newComment, author:profileData, timestamp: new Date() },...comments,
      ]);
        setNewComment("");
        setShowCommentInput(false)
    }
  };
  const handleCancelComment = () => {
    setNewComment("");
    setShowCommentInput(false);
    console.log("hlllalsdfalkdsfla")
  }
  const handleDeleteComment = () => {
    setDeletePopup(false)
    let response = commentApi.deleteComment(selectedComment._id);
    
    setComments(
      comments.filter((comment)=> comment._id !== selectedComment._id)
    )
    setSelctedComment(null)
  }

  return (
    <div className="bg-background overflow-y-scroll p-4">
      <div className="flex w-full">
      <div className="  p-3 flex-1 max-h-fit overflow-hidden">
        {/* First column content */}
        <h3 className="text-lg font-semibold mb-4">Files</h3>

        <div className=" space-y-3 max-h-full max-h-80 overflow-y-scroll ">
          {task.files && task.files.length > 0 ? (
            task.files.map((file, index) => {
              const { fileType, previewLink, downloadLink, url } = file;

              return (
                <div key={index} className="flex flex-col space-y-2 border border-solid-foreground rounded p-3">
                  {/* File Preview */}
                  {fileType.startsWith('image/') ? (
                    <div className="flex justify-center mb-2">
                      <img src={previewLink} alt={`Preview of ${file.name}`} className="max-w-xs max-h-40 object-cover" />
                    </div>
                  ) : fileType === 'application/pdf' ? (
                    <div className="flex justify-center mb-2">
                      <iframe src={previewLink} width="100%" height="200px" title={`Preview of ${file.name}`} />
                    </div>
                  ) : (
                    <div className="flex justify-center mb-2">
                      {/* For unsupported file types, display a generic icon */}
                      <span className="text-gray-500">No preview available</span>
                    </div>
                  )}

                  {/* File Download Button */}
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium text-blue-600">
                      <a href={downloadLink} target="_blank" download>
                        Download
                      </a>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        View File
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No files attached</p>
          )}
        </div>
      </div>

  <div className="p-3 flex-1">
    <div className='flex flex-col gap-3'>
      <Badge className='w-fit'>{task.state}</Badge>

      <div className="border border-solid-forground rounded ">
        <div className="row p-3 border border-b-solid">
          <p>Details</p>
        </div>
        <div className="p-3">
          <p>Lead</p>
          <div>
            {/* Lead info */}
          </div>
        </div>
        <div className="p-3 flex content-evenly">
          <p>Project</p>
          <div>{task?.project?.name}</div>
        </div>
        <div className="p-3 flex content-evenly">
          <p>Module</p>
          <div>{task?.module?.name}</div>
        </div>
        <div className="p-3 flex content-evenly">
          <p>Start Date</p>
          <div>{startDate}</div>
        </div>
        <div className="p-3 flex content-evenly">
          <p>End Date</p>
          <div>{endDate}</div>
        </div>
      </div>
    </div>
  </div>
      </div>
      
      { showCommentInput && <div className="mt-6 my-5 ">
          <h3 className="text-lg font-semibold mb-2">Add a Comment</h3>
        <RichTextEditor value={newComment} onChange={setNewComment} />
        <div className='flex gap-3'>
        <Button variant='secondary' className="mt-4"  onClick={handleCancelComment}>
            Cancel
        </Button>
        <Button className="mt-4" onClick={handleAddComment}>
            Comment
          </Button>
        </div>
        
        </div>
}
        {/* Comments Section */}
      <h3 className="text-lg font-semibold my-4 ">Comments</h3>
    {!showCommentInput && <div className='bg-foreground text-background w-fit p-3 rounded-full my-5' onClick={()=>setShowCommentInput(true)}> <LucidePencil />  </div> }
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="flex items-start space-x-4 p-3  hover:border relative  ">
              <Avatar>
                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{comment.author.name}</p>
                      <p className="text-sm text-muted-foreground">{moment(comment.timestamp).fromNow()}</p>
                <div className="mt-2" dangerouslySetInnerHTML={{__html: comment.content }} />
              </div>
              {(comment.author._id == profileData._id) && <div className=' absolute end-5 '>
                <Badge variant='destructive' onClick={() => { setSelctedComment(comment); setDeletePopup(true)}}  >delete</Badge>
              </div>}
            </div>
          ))}
        </div>

      

      {/* confirmaiton for delete comment */}
      <ConfirmationPopover title="Delete Comment" description="Are you sure to delete this comment?" isOpen={deletePopup} onCancel={() => { setSelctedComment(null); setDeletePopup(false)}} onConfirm={handleDeleteComment}></ConfirmationPopover>

    </div>
  )
}

export default TaskDetailedView


   
function convertDate(dateString) {
    const date = new Date(dateString);

return date.toLocaleString('en-US', {
weekday: 'long', 
year: 'numeric', 
month: 'long', 
day: 'numeric', 
hour: '2-digit',
minute: '2-digit', 
});
}