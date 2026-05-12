export const useMobileMenu = () => {
  const isMobileMenuOpen = useState('mobile_menu', () => false)
  
  const closeMenu = () => {
    isMobileMenuOpen.value = false
    document.body.classList.remove('menu-open')
  }

  const toggleMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
    document.body.classList.toggle('menu-open', isMobileMenuOpen.value)
  }

  return { isMobileMenuOpen, closeMenu, toggleMenu }
}