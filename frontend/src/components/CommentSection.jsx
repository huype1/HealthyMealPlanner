import React, {useEffect, useState} from "react";
import {Card, Form, Button, Image, Modal} from "react-bootstrap";
import Rating from "react-rating";
import commentService from "../services/comments.js";
import {useAuthStore} from "../stores/index.js";
import {handleImageUpload} from "../services/supabaseClient.js";
import ConfirmationModal from "./ConfirmDelete.jsx";
import CustomSpinner from "./CustomSpinner.jsx";
import {useNavigate} from "react-router-dom";

const CommentSection = ({dishId, reloadDish}) => {
  const navigate = useNavigate();
  const {user} = useAuthStore();
  const [userComment, setUserComment] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imageLink, setImageLink] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    content: "",
    imageUrl: "",
    imageFile: null,
    previewUrl: null
  });

  const resetForm = () => {
    setFormData({
      rating: 0,
      content: "",
      imageUrl: "",
      imageFile: null,
      previewUrl: null
    });
  }

  const loadUserComment = () => {
    if (user.userId) {
      commentService.getUserRating({dishId, userId: user.userId}).then((result) => {
        setUserComment(result)
      })
    }
  };

  const loadComments = () => {
    commentService.get(dishId).then((result) => {
      console.log(result)
      setComments(result)

    })
  };

  useEffect(() => {
    setIsLoading(true);
    loadUserComment();
    loadComments();
    setIsLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
        previewUrl: URL.createObjectURL(file)
      });
      return () => URL.revokeObjectURL(formData.previewUrl);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      rating: userComment.rating,
      content: userComment.content || "",
      imageUrl: userComment.imageUrl || "",
      imageFile: null,
      previewUrl: userComment.imageUrl
    });
  };

  const handleDelete = async () => {
      try {
        await commentService.remove(dishId);
        console.log("Reivew is removed")
        setUserComment(null);
        setShowDeleteModal(false);
        loadComments();
        await reloadDish();
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (formData.rating === 0) {
        setError(true)
        return;
      }
      let imageUrl = formData.imageUrl;

      if (formData.imageFile) {
        imageUrl = await handleImageUpload(formData.imageFile, user.userId, 'rating-images');
      }

      if (isEditing) {
        await commentService.update({
          id: userComment.id,
          rating: formData.rating,
          content: formData.content,
          imageUrl
        }, dishId);
      } else {
        await commentService.create({
          dishId,
          userId: user.userId,
          rating: formData.rating,
          content: formData.content,
          imageUrl
        });
      }

      await loadComments();
      await loadUserComment();
      await reloadDish();
      resetForm();
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);

    }
  };

  const renderForm = () => (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Card className="p-3">
        <div className="mb-3">
          <label className="mb-2">Rating</label>
          <div>
            <Rating
              initialRating={formData.rating}
              onChange={(value) => {
                setFormData({...formData, rating: value})
                setError(false)
              }}
              emptySymbol={<i className="bi bi-star" style={{color: "gold"}}></i>}
              fullSymbol={<i className="bi bi-star-fill" style={{color: "gold"}}></i>}
            />
            {error && (
              <p style={{color: "red"}}>Rating is required!</p>
            )}
          </div>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Your Review</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Do you recommend this dish..."
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Add Image</Form.Label>
          <Form.Control
            type="file"
            onChange={handleImageChange}
            accept="image/*"
          />
          {(formData.previewUrl || formData.imageUrl) && (
            <Image
              src={formData.previewUrl || formData.imageUrl}
              alt="Review"
              className="mt-2 me-3"
              style={{maxHeight: '100px', cursor: 'pointer'}}
              onClick={() => {
                setShowModal(true)
                setImageLink(formData.previewUrl || formData.imageUrl)
              }}
            />
          )}
        </Form.Group>

        <div className="d-flex gap-2">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' :  isEditing ? "Update Review" : "Submit Review"}
          </Button>

          <Button
            disabled={isSubmitting}
            variant="secondary"
            onClick={() => {
              resetForm();
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Card>
    </Form>
  );

  const renderUserComment = () => (
    <Card key={userComment.id} className="mb-3">
      <Card.Title className="d-flex justify-content-between align-items-center p-3">
        <div>
          <h5 className="mb-2">Your review</h5>
          <Rating
            initialRating={userComment.rating}
            readonly
            emptySymbol={<i className="bi bi-star" style={{color: "gold"}}></i>}
            fullSymbol={<i className="bi bi-star-fill" style={{color: "gold"}}></i>}
          />
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={handleEdit}>
            <i className="bi bi-pencil"></i>
          </Button>
          <Button variant="outline-danger" onClick={() => setShowDeleteModal(true)}>
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      </Card.Title>
      <Card.Body className="d-flex">
        {userComment.imageUrl && (
          <Image
            src={userComment.imageUrl}
            alt="Review"
            className="me-3"
            style={{maxHeight: '100px', cursor: 'pointer'}}
            onClick={() => {
              setShowModal(true)
              setImageLink(userComment.imageUrl)
            }}
          />
        )}
        <div>
          {userComment.content?.split('\n').map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </Card.Body>
    </Card>
  );

  if (isLoading){
    return <CustomSpinner/>
  }
  return (
    <>
      <h3>Comments</h3>
      {
        user.userId !== null &&userComment && !isEditing ? (
          renderUserComment()
        ) : <Button variant="primary" onClick={() => navigate('/login')}>
          Login to create your review
        </Button>
      }

      {user.userId !== null && (!userComment || (isEditing && user.userId)) && renderForm()}

      <h3 className="text-xl font-semibold mb-3">All Reviews</h3>
      {comments.map(comment => {
        if (userComment && comment.id === userComment.id) {
          return null;
        }
        return (
          <Card key={comment.id} className="mb-3">
            <Card.Title><h5 className="mb-2">{comment.user.userName}</h5>
              <Rating
                initialRating={comment.rating}
                readonly
                emptySymbol={<i className="bi bi-star" style={{color: "gold"}}></i>}
                fullSymbol={<i className="bi bi-star-fill" style={{color: "gold"}}></i>}
              /></Card.Title>
            <Card.Body className="d-flex">
              {comment.imageUrl && (
                <Image
                  src={comment.imageUrl}
                  alt="Review"
                  className="me-3"
                  style={{maxHeight: '100px', cursor: 'pointer'}}
                  onClick={() => {
                    setShowModal(true)
                    setImageLink(comment.imageUrl)
                  }}
                />
              )}
              <div>
                {comment.content?.split('\n').map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </Card.Body>
          </Card>
        )
      })}
      <Modal show={showModal} onHide={() => setShowModal(false)} closeButton centered>
        <Modal.Body>
          <Image
            src={imageLink}
            alt="Review"
            fluid
            style={{width: 'fit-content'}}
          />
        </Modal.Body>
      </Modal>
      <ConfirmationModal
        show={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        title="Delete your review"
        message="Are you sure you want to the review you've made"
        confirmText="Delete"
        onConfirm={handleDelete}
      />
    </>
  )
};

export default CommentSection;