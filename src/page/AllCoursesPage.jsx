import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/header";

const allCourses = [
  {
    id: 1,
    title: "React Development Masterclass",
    duration: "12 weeks",
    students: 1234,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
    description: "Learn modern React development from basics to advanced concepts",
    category: "Frontend Development"
  },
  {
    id: 2,
    title: "JavaScript Fundamentals",
    duration: "8 weeks",
    students: 856,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
    description: "Master JavaScript from ground up with practical projects",
    category: "Programming"
  },
  {
    id: 3,
    title: "UI/UX Design Course",
    duration: "10 weeks",
    students: 642,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    description: "Design beautiful and user-friendly interfaces",
    category: "Design"
  },
  {
    id: 4,
    title: "Python for Beginners",
    duration: "6 weeks",
    students: 923,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop",
    description: "Start your programming journey with Python",
    category: "Programming"
  },
  {
    id: 5,
    title: "Mobile App Development",
    duration: "14 weeks",
    students: 567,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
    description: "Build native mobile apps for iOS and Android",
    category: "Mobile Development"
  },
  {
    id: 6,
    title: "Data Science Bootcamp",
    duration: "16 weeks",
    students: 789,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    description: "Master data analysis and machine learning",
    category: "Data Science"
  },
  {
    id: 7,
    title: "Database Management Systems",
    duration: "10 weeks",
    students: 1156,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop",
    description: "Master database design, SQL, and data management",
    category: "Database"
  },
  {
    id: 8,
    title: "Full Stack Web Development",
    duration: "20 weeks",
    students: 945,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
    description: "Complete web development from frontend to backend",
    category: "Full Stack"
  },
  {
    id: 9,
    title: "Digital Marketing Mastery",
    duration: "8 weeks",
    students: 672,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    description: "Learn SEO, social media, and online marketing strategies",
    category: "Marketing"
  },
  {
    id: 10,
    title: "Machine Learning with Python",
    duration: "14 weeks",
    students: 534,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop",
    description: "Build intelligent systems with machine learning algorithms",
    category: "Machine Learning"
  },
  {
    id: 11,
    title: "Cybersecurity Fundamentals",
    duration: "12 weeks",
    students: 387,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop",
    description: "Protect systems and networks from cyber threats",
    category: "Security"
  },
  {
    id: 12,
    title: "Cloud Computing with AWS",
    duration: "10 weeks",
    students: 698,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
    description: "Master cloud infrastructure and AWS services",
    category: "Cloud Computing"
  }
];

const categories = ["All", "Programming", "Frontend Development", "Design", "Data Science", "Database", "Mobile Development", "Full Stack", "Marketing", "Machine Learning", "Security", "Cloud Computing"];

function CourseCard({ course }) {
  return (
    <Link 
      to={`/course/${course.id}`} 
      className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105 border border-gray-100"
    >
      <img 
        src={course.image} 
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
            {course.category}
          </span>
          <div className="flex items-center gap-1 text-sm">
            <span>⭐</span>
            <span className="font-semibold">{course.rating}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span>🕐</span>
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>👥</span>
            <span>{course.students}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{course.price}</span>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function AllCoursesPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = allCourses.filter(course => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleQuickNavigateToDatabase = () => {
    navigate('/course/7'); 
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-50">
      <Header />
      
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate('/home')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <span className="mr-2">←</span>
          Back to Home
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">All Courses</h1>
          <p className="text-gray-600 text-2xl mb-6">Explore our complete collection of courses</p>
          
          
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {filteredCourses.length > 0 && (
          <div className="text-center mt-12">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Want to see more courses?</h3>
              <p className="text-gray-600 mb-4">We're constantly adding new courses to our platform</p>
              <button className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Subscribe for Updates
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}