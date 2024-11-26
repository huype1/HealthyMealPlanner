import {useState, useEffect} from 'react';
import {Form, Button, Image, Card} from 'react-bootstrap';
import {useAuthStore} from "../stores/index.js";
import {handleImageUpload} from "../services/supabaseClient.js";

const RecipeForm = ({
                      existingStep = null,
                      currentStepsLength = 0,
                      onSubmit,
                    }) => {
  const {user} = useAuthStore();
  const [formData, setFormData] = useState({
    step: existingStep ? existingStep.step : currentStepsLength + 1,
    content: existingStep ? existingStep.content : '',
    imageFile: null,
    imageUrl: existingStep ? existingStep.imageUrl : ''
  });

  const [imagePreview, setImagePreview] = useState(existingStep ? existingStep.imageUrl : '');
  const [isLoading, setIsLoading] = useState(false);

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
      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let submitData = {
        step: formData.step,
        content: formData.content,
        imageUrl: formData.imageUrl
      };

      if (formData.imageFile) {
        submitData.imageUrl = await handleImageUpload(formData.imageFile, user.userId, 'recipe-images');
      }

      await onSubmit(submitData, existingStep?.id);

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save step. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 mb-4">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Step Number</Form.Label>
          <Form.Control
            type="number"
            name="step"
            value={formData.step}
            readOnly
            disabled
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Instructions</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            placeholder="Enter step instructions..."
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Step Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-2"
          />

          {imagePreview && (
            <div className="mt-2">
              <p>Preview:</p>
              <Image
                src={imagePreview}
                alt="Step preview"
                style={{maxWidth: '200px', maxHeight: '200px'}}
                thumbnail
              />
            </div>
          )}
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : existingStep ? 'Update Step' : 'Add Step'}
        </Button>
      </Form>
    </Card>
  );
};

export default RecipeForm;