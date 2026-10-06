import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { isTouchDevice } from './hooks/usePointer'
import { EASE } from './lib/motion'

import Preloader from './components/Preloader'
import Background from './components/Background'
import CustomCursor from './components/CustomCursor'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  const [skipIntro] = useState(isTouchDevice)
  const [ready, setReady] = useState(skipIntro)
  useSmoothScroll()

  const handleDone = useCallback(() => setReady(true), [])

  return (
    <>
      <Preloader onDone={handleDone} skip={skipIntro} />
      <Background />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />

      <motion.main
        initial={skipIntro ? false : { opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <Hero />

        {/* Divider between hero and the content stack */}
        <SectionDivider />

        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </motion.main>

      <Footer />
    </>
  )
}

/** Hairline that draws itself across the viewport between sections. */
function SectionDivider() {
  return (
    <div className="container-x">
      <motion.div
        className="h-px origin-center bg-gradient-to-r from-transparent via-sage/20 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: EASE }}
      />
    </div>
  )
}
