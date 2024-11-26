import {useNavigate} from "react-router-dom";

const MealPlanDishes = ({dishes}) => {
  const navigate = useNavigate()
  return (<div className='ps-2'>
      {dishes.map((dish) => (
        <div key={dish.id}
             className='d-flex align-items-center mb-2 px-2 px-1 border border-2 border-secondary rounded-2 pointer-event bg-info-subtle'
             style={{cursor: 'pointer'}}
             onClick={() => navigate(`/dish/${dish.id}`)}>
          <div
            style={{
              flexShrink: 0,
              width: "50px",
              marginRight: "24px",
            }}
          >
            <img
              src={dish.imageUrl}
              alt={dish.name}
              className='rounded-2'
              style={{
                width: "65px",
                height: "50px",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.src = "/api/placeholder/50/50";
              }}
            />
          </div>
          <div>
            <div className='fw-bold'>{dish.name}</div>
            <span className='text-muted small badge bg-warning'>{dish.dishType}</span>&nbsp;
            <span className='text-muted small badge bg-primary-subtle'>{dish.cuisine}</span>
            <div className={'small'}><strong>Servings:</strong> {dish.MealPlanDish.servings}</div>
          </div>
        </div>

      ))}
    </div>
  )
}
export default MealPlanDishes;