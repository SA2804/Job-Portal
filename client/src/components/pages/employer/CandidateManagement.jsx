import { Table, Button } from 'react-bootstrap';
import '../../../../public/styles/CandidateManagement.css';
import PropTypes from "prop-types";
import axios from 'axios';
import Swal from "sweetalert2";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CandidateManagement = ({ candidates }) => {
  const [finalCandidates, setFinalCandidates] = useState(candidates);
  const navigate = useNavigate();

  const handleReject = async (serial) => {
    const { value: input } = await Swal.fire({
      title: "Are you sure you want to reject this Candidate's Application?",
      input: 'text',
      inputPlaceholder: 'Enter either y/n',
      showCancelButton: true,
      inputValidator: (value) => {
        if (value !== 'y' && value !== 'n') {
          return "Enter a valid input (y/n)";
        } else if (!value) {
          return 'You need to enter either (y/n)';
        }
      }
    });
    
    if (input === 'y') {
      try {
        const data = { sno: serial };
        const response = await axios.post('http://localhost:3001/rejectApplication', data);
        Swal.fire('Rejected!', `${response.data.text}`, 'success');
        setFinalCandidates(finalCandidates.filter(finalCandidate => finalCandidate.sno !== serial));
        navigate('/EmployerHomepage')
        
      } catch (error) {
        console.error(error); // Log error details
        Swal.fire('Error!', 'There was an error rejecting the candidate.', 'error');
      }
    }
  }

  return (
    <div className="candidate-table-container">
      <p className="text-dark text-center fw-bold fs-4">Applications Management:</p>
        <Table striped bordered hover className="candidate-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Job</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Resume</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {finalCandidates.map((candidate) => (
              <tr key={candidate.sno}>
                <td>
                  {candidate.image ? (
                    <img src={candidate.image} alt="Candidate" className="candidate-image" />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </td>
                <td>{candidate.name}</td>
                <td>{candidate.title}</td>
                <td>{candidate.email}</td>
                <td>{candidate.phone}</td>
                <td>{candidate.address}</td>
                <td>
                  <a href={candidate.resume} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                </td>
                <td>
                  <Button className='mb-1' variant="danger" onClick={() => handleReject(candidate.sno)}>
                    &#10539;
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
    </div>
  );
};

CandidateManagement.propTypes = {
  candidates: PropTypes.arrayOf(
    PropTypes.shape({
      sno: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      image: PropTypes.string,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      resume: PropTypes.string.isRequired
    })
  ).isRequired
};

export default CandidateManagement;
