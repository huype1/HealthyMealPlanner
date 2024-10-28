import { Button } from 'react-bootstrap';
import { useNavigate} from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <h3>{`The content doesn't exist or you're not allow to access this content`}</h3>
      <Button onClick={() => navigate('/') } variant='primary'>Go to Home Page</Button>
    </div>
  );
};
export default NotFoundPage;