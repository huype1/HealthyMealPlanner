import { useAuthStore } from '../stores/authStore';

const Footer = () => {
  const user = useAuthStore(state => state.user); 
  return (
    <footer className='bg-white text-dark fw-semibold mt-4'>
      <hr></hr>
      <div className='container-fluid text-center text-md-left'>
        <div className='row'>
          <div className='col-md-6 mt-md-0 mt-3'>
            <h5 className='text-uppercase'>Meal Planner</h5>
            <p>
              A simple way to create a healthier diet
            </p>
            <p>Đề án KHMT 64</p>
          </div>

          <hr className='clearfix w-100 d-md-none pb-0' />

          <div className='col-md-3 mb-md-0'>
            <h5 className='text-uppercase'>Links</h5>
            <ul className='list-unstyled'>
              <li>
                <a href='/' className='custom-link'>Homepage</a>
              </li>
              <li>
                <a href='/dishes' className='custom-link'>Dishes</a>
              </li>
              <li>
                <a href='/meal-plans' className='custom-link'>Meal Plan</a>
              </li>
            </ul>
          </div>

          <div className='col-md-3 mb-md-0'>
            <h5 className='text-uppercase'>Socials</h5>
            <ul className='list-unstyled'>
              <li>
                <a href='#!' className='custom-link'>Instagram</a>
              </li>
              <li>
                <a href='#!' className='custom-link'>Facebook</a>
              </li>
              <li>
                <a href='#!' className='custom-link'>Github</a>
              </li>

            </ul>
          </div>
        </div>
      </div>

      <div className='footer-copyright text-center'>
        © 2024 Copyright: <a href='https://www.neu.edu.vn' className='custom-link'>neu.edu.vn</a>
      </div>
    </footer>
  );
};

export default Footer;
