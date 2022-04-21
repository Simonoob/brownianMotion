import { useEffect } from 'react'
import { AspectRatio, Container } from '@chakra-ui/react'
import styled from '@emotion/styled'
import Experience from './experience'

const Canvas = styled.canvas`
  width: 100% !important;
  height: 100% !important;
`

const ExperienceComponent = () => {
  useEffect(() => {
    window.experience = new Experience(
      document.querySelector('.bannerExperience')
    )
  }, [])

  return (
    <Container w="100%" maxW="100%" mt={0} p={0} mb={-100} zIndex={1}>
      <AspectRatio ratio={{ base: 3 / 4, sm: 16 / 9 }}>
        <Canvas className="bannerExperience" />
      </AspectRatio>
    </Container>
  )
}

export default ExperienceComponent
