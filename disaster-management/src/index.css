@tailwind base;
@tailwind components;
@tailwind utilities;

/* Animated Background */
.bg-animate {
  background: linear-gradient(135deg, 
    rgba(15, 23, 42, 0.9),
    rgba(23, 37, 84, 0.9),
    rgba(30, 58, 138, 0.9)
  );
  position: relative;
}

.bg-animate::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(56, 189, 248, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(99, 102, 241, 0.15) 0%, transparent 40%);
  animation: pulse 8s ease infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Glass Effect */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.glass-dark {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

/* macOS Dock Animations */
.dock {
  padding: 0.5rem;
  border-radius: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.dock:hover {
  padding: 0.75rem;
  gap: 0.75rem;
}

.dock-item {
  position: relative;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-origin: bottom;
}

.dock:hover .dock-item {
  transform: translateY(-0.5rem);
}

.dock-item:hover {
  transform: translateY(-1rem) scale(1.2) !important;
}

.dock-item:hover ~ .dock-item {
  transform: translateX(0.5rem);
}

/* Card Animations */
.card {
  @apply rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.card:hover {
  transform: translateY(-4px) scale(1.01);
}

/* Modal Animations */
.modal-overlay {
  @apply fixed inset-0 bg-black/50 backdrop-blur-sm;
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  @apply fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-4;
  animation: modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -40%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

/* Hover Effects */
.hover-lift {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.hover-glow {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
}

.hover-scale {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-scale:hover {
  transform: scale(1.02);
}

/* Responsive Design */
@media (max-width: 640px) {
  .modal-content {
    @apply mx-4 max-w-[calc(100%-2rem)];
  }

  .dock {
    @apply px-2 py-1;
  }

  .dock-item {
    @apply scale-75;
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Active Disasters Card */
.disaster-card {
  @apply glass rounded-xl p-6 hover-lift transition-all duration-300;
  border-radius: 1rem;
  overflow: hidden;
}

.disaster-card:hover {
  @apply hover-glow;
  border-color: rgba(59, 130, 246, 0.5);
}

/* Modal Responsiveness */
.modal-wrapper {
  @apply fixed inset-0 z-50 overflow-y-auto;
}

.modal-container {
  @apply flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0;
}

.modal-panel {
  @apply relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6;
}

/* Navbar Dropdown Animations */
.dropdown {
  animation: dropdownSlide 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top;
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}