import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Settings, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getInitials = (email: string | undefined) => {
    if (!email) return 'U';
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase();
  };

  const getDisplayName = (email: string | undefined) => {
    if (!email) return 'User';
    const username = email.split('@')[0];
    return username.charAt(0).toUpperCase() + '. ' + username.slice(1);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-b border-gray-800">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            FitnessAI
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-white hover:text-purple-400 transition-colors font-medium">
            Home
          </Link>
          <Link to="/ai-models" className="text-white hover:text-purple-400 transition-colors font-medium">
            AI Models
          </Link>
          <Link to="/workout" className="text-white hover:text-purple-400 transition-colors font-medium">
            Workout
          </Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-3 text-white hover:text-purple-400">
                  <Avatar className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <AvatarFallback className="text-sm bg-gradient-to-r from-purple-500 to-pink-500">
                      {getInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block font-medium">
                    {getDisplayName(user.email)}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-700">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center space-x-2 text-white hover:text-purple-400">
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center space-x-2 text-white hover:text-purple-400">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-red-400 hover:text-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300">
              <Link to="/auth">Get Started</Link>
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-t border-gray-800">
          <div className="px-6 py-4 space-y-4">
            <Link to="/" className="block text-white hover:text-purple-400 transition-colors font-medium">
              Home
            </Link>
            <Link to="/ai-models" className="block text-white hover:text-purple-400 transition-colors font-medium">
              AI Models
            </Link>
            <Link to="/workout" className="block text-white hover:text-purple-400 transition-colors font-medium">
              Workout
            </Link>
            {!user && (
              <Link to="/auth" className="block bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-semibold py-2 px-6 rounded-lg text-center">
                Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;