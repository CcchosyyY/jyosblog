export default function Footer() {
  return (
    <footer className="border-t border-light/10 bg-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-light/60 text-sm">
            &copy; {new Date().getFullYear()} MyBlog. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light/60 hover:text-teal transition-colors"
            >
              GitHub
            </a>
            <a
              href="mailto:contact@example.com"
              className="text-light/60 hover:text-teal transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
