import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const MODULE_COLORS = {
  listening: 0x7c5cfc,
  reading:   0x1fd9a0,
  writing:   0xf9a825,
  speaking:  0xf75c5c,
}

const MODULE_LABELS = ['Listening', 'Reading', 'Writing', 'Speaking']
const MODULE_KEYS   = ['listening', 'reading', 'writing', 'speaking']
const MODULE_SHORT  = ['L', 'R', 'W', 'S']

// Fibonacci-sphere style placement so the 4 orbs sit evenly in true 3D
// (not flat on a single plane) — gives the whole thing real depth.
function spherePoint(i, n, radius) {
  const phi = Math.acos(1 - (2 * (i + 0.5)) / n)
  const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

export default function SkillSphere({ scores = { listening: 0, reading: 0, writing: 0, speaking: 0 }, size = 320 }) {
  const mountRef   = useRef(null)
  const labelsRef  = useRef(null)

  useEffect(() => {
    const W = size, H = size
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mountRef.current.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 0, 5.2)

    // ── World group (everything rotates together as one rigid sphere) ──────
    const world = new THREE.Group()
    scene.add(world)

    // ── Lighting rig ─────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.35))
    const keyLight = new THREE.PointLight(0x7c5cfc, 3.2, 14)
    keyLight.position.set(3, 3, 3)
    scene.add(keyLight)
    const rimLight = new THREE.PointLight(0x1fd9a0, 1.4, 14)
    rimLight.position.set(-3, -2, -3)
    scene.add(rimLight)
    const fillLight = new THREE.PointLight(0xffffff, 0.6, 14)
    fillLight.position.set(0, -3, 2)
    scene.add(fillLight)

    // ── Overall average band → core color blends toward it ─────────────────
    const vals = MODULE_KEYS.map(k => scores[k] || 0).filter(Boolean)
    const avg  = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
    const avgNorm = Math.min(1, avg / 9)

    // ── Layered glowing core (fake bloom via stacked transparent shells) ───
    const coreColor = new THREE.Color(0x7c5cfc).lerp(new THREE.Color(0x1fd9a0), avgNorm * 0.5)

    const coreInner = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 32, 32),
      new THREE.MeshBasicMaterial({ color: coreColor, transparent: true, opacity: 0.9 })
    )
    world.add(coreInner)

    const glowShells = []
    ;[0.55, 0.72, 0.92, 1.15].forEach((r, idx) => {
      const shell = new THREE.Mesh(
        new THREE.SphereGeometry(r, 32, 32),
        new THREE.MeshBasicMaterial({ color: coreColor, transparent: true, opacity: 0.085 - idx * 0.015, side: THREE.BackSide })
      )
      world.add(shell)
      glowShells.push(shell)
    })

    // Wireframe lattice sphere (the "skill sphere" shell itself)
    const latticeGeo = new THREE.IcosahedronGeometry(1.9, 2)
    const latticeMat = new THREE.MeshBasicMaterial({ color: 0x7c5cfc, wireframe: true, transparent: true, opacity: 0.10 })
    const lattice = new THREE.Mesh(latticeGeo, latticeMat)
    world.add(lattice)

    // Second counter-rotating lattice for depth
    const lattice2 = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.55, 1),
      new THREE.MeshBasicMaterial({ color: 0x1fd9a0, wireframe: true, transparent: true, opacity: 0.07 })
    )
    world.add(lattice2)

    // ── Module orbs — true 3D placement via fibonacci sphere ───────────────
    const ORB_RADIUS = 2.05
    const orbPositions = MODULE_KEYS.map((_, i) => spherePoint(i, 4, ORB_RADIUS))

    const orbs = []
    const orbGroups = []
    MODULE_KEYS.forEach((key, i) => {
      const score = scores[key] || 0
      const normalised = Math.max(0.18, score / 9)
      const color = MODULE_COLORS[key]
      const pos = orbPositions[i]

      const orbGroup = new THREE.Group()
      orbGroup.position.copy(pos)
      world.add(orbGroup)
      orbGroups.push(orbGroup)

      // Core orb
      const geo = new THREE.SphereGeometry(0.16 + normalised * 0.16, 32, 32)
      const mat = new THREE.MeshPhysicalMaterial({
        color, emissive: color, emissiveIntensity: 0.65,
        metalness: 0.2, roughness: 0.25, clearcoat: 0.6, clearcoatRoughness: 0.2,
        transparent: true, opacity: 0.95,
      })
      const orb = new THREE.Mesh(geo, mat)
      orbGroup.add(orb)
      orbs.push({ mesh: orb, baseScale: 1, key, basePos: pos.clone() })

      // Soft glow halo around orb
      const haloMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.18, side: THREE.BackSide })
      const halo = new THREE.Mesh(new THREE.SphereGeometry((0.16 + normalised * 0.16) * 1.8, 24, 24), haloMat)
      orbGroup.add(halo)

      // Double ring (orbit indicator) — billboarded each frame
      const ringGeo = new THREE.RingGeometry(0.26 + normalised * 0.1, 0.30 + normalised * 0.1, 48)
      const ringMat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, opacity: 0.45, transparent: true })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      orbGroup.add(ring)
      orb.userData.ring = ring

      // Score-progress arc ring (shows band/9 as an arc)
      const arcFrac = Math.max(0.04, score / 9)
      const arcGeo = new THREE.RingGeometry(0.34 + normalised * 0.1, 0.37 + normalised * 0.1, 48, 1, 0, Math.PI * 2 * arcFrac)
      const arcMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, opacity: 0.85, transparent: true })
      const arc = new THREE.Mesh(arcGeo, arcMat)
      orbGroup.add(arc)
      orb.userData.arc = arc

      // Connector line from core to orb (curved-feel via 2-segment)
      const mid = pos.clone().multiplyScalar(0.55).add(new THREE.Vector3((Math.random()-0.5)*0.3, (Math.random()-0.5)*0.3, (Math.random()-0.5)*0.3))
      const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0,0,0), mid, pos.clone().multiplyScalar(0.88))
      const curvePoints = curve.getPoints(20)
      const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints)
      const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.4 })
      world.add(new THREE.Line(lineGeo, lineMat))

      // Small orbiting satellite particle per orb (extra liveliness)
      const satMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
      const sat = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), satMat)
      orbGroup.add(sat)
      orb.userData.sat = sat
      orb.userData.satAngle = Math.random() * Math.PI * 2
      orb.userData.satRadius = 0.16 + normalised * 0.16 + 0.12
    })

    // ── Ambient floating particle field (depth dust) ───────────────────────
    const particleGeo = new THREE.BufferGeometry()
    const count = 260
    const positionsArr = new Float32Array(count * 3)
    const particleColors = new Float32Array(count * 3)
    const tmpColor = new THREE.Color()
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = 1.6 + Math.random() * 1.3
      positionsArr[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positionsArr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positionsArr[i * 3 + 2] = r * Math.cos(phi)
      tmpColor.set([0x7c5cfc, 0x1fd9a0, 0xf9a825, 0xf75c5c][i % 4])
      tmpColor.toArray(particleColors, i * 3)
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positionsArr, 3))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))
    const particleMat = new THREE.PointsMaterial({ size: 0.022, transparent: true, opacity: 0.55, vertexColors: true, sizeAttenuation: true })
    const particles = new THREE.Points(particleGeo, particleMat)
    world.add(particles)

    // Slow-orbiting "data ring" — like a Saturn ring tilted through the sphere
    const dataRingGeo = new THREE.TorusGeometry(2.35, 0.006, 8, 120)
    const dataRingMat = new THREE.MeshBasicMaterial({ color: 0x7c5cfc, transparent: true, opacity: 0.3 })
    const dataRing = new THREE.Mesh(dataRingGeo, dataRingMat)
    dataRing.rotation.x = Math.PI / 2.3
    world.add(dataRing)
    const dataRing2 = new THREE.Mesh(dataRingGeo.clone(), new THREE.MeshBasicMaterial({ color: 0x1fd9a0, transparent: true, opacity: 0.2 }))
    dataRing2.rotation.x = Math.PI / 1.7
    dataRing2.rotation.y = Math.PI / 5
    world.add(dataRing2)

    // ── Interaction: drag to rotate, with inertia; auto-spin when idle ────
    let isDragging = false, prevX = 0, prevY = 0
    let velX = 0.0009, velY = 0.0014
    let dragVelX = 0, dragVelY = 0
    let idleTimer = 0

    const el = renderer.domElement
    el.style.touchAction = 'none'

    const onDown = (x, y) => { isDragging = true; prevX = x; prevY = y; idleTimer = 0 }
    const onMove = (x, y) => {
      if (!isDragging) return
      const dx = (x - prevX) * 0.006
      const dy = (y - prevY) * 0.006
      world.rotation.y += dx
      world.rotation.x += dy
      dragVelX = dx; dragVelY = dy
      prevX = x; prevY = y
    }
    const onUp = () => { isDragging = false; velX = dragVelY * 0.6; velY = dragVelX * 0.6 }

    el.addEventListener('mousedown', e => onDown(e.clientX, e.clientY))
    window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY))
    window.addEventListener('mouseup', onUp)
    el.addEventListener('touchstart', e => { const t = e.touches[0]; onDown(t.clientX, t.clientY) }, { passive: true })
    el.addEventListener('touchmove', e => { const t = e.touches[0]; onMove(t.clientX, t.clientY) }, { passive: true })
    el.addEventListener('touchend', onUp)

    let frame
    const clock = new THREE.Clock()
    const animate = () => {
      frame = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      if (!isDragging) {
        idleTimer += 1
        // Gentle momentum decay back toward steady auto-rotate
        world.rotation.y += velX
        world.rotation.x += velY * 0.4
        velX += (0.0011 - velX) * 0.02
        velY += (0 - velY) * 0.03
      }

      // Pulse the core + glow shells
      const pulse = 1 + Math.sin(t * 1.4) * 0.06
      coreInner.scale.setScalar(pulse)
      glowShells.forEach((shell, i) => {
        shell.scale.setScalar(1 + Math.sin(t * 1.1 + i * 0.6) * 0.04)
      })

      // Counter-rotate lattices for parallax depth
      lattice.rotation.y -= 0.0016
      lattice.rotation.x += 0.0008
      lattice2.rotation.y += 0.0022
      lattice2.rotation.x -= 0.0011

      // Bob the orbs gently + spin their rings + orbit their satellites
      orbs.forEach((o, i) => {
        const bob = Math.sin(t * 0.9 + i * 1.7) * 0.04
        o.mesh.parent.position.copy(o.basePos.clone().add(new THREE.Vector3(0, bob, 0)))
        if (o.mesh.userData.ring) o.mesh.userData.ring.lookAt(camera.position)
        if (o.mesh.userData.arc) o.mesh.userData.arc.lookAt(camera.position)
        const sat = o.mesh.userData.sat
        if (sat) {
          o.mesh.userData.satAngle += 0.025
          const sr = o.mesh.userData.satRadius
          sat.position.set(Math.cos(o.mesh.userData.satAngle) * sr, Math.sin(o.mesh.userData.satAngle * 1.3) * sr * 0.5, Math.sin(o.mesh.userData.satAngle) * sr)
        }
        const s = 1 + Math.sin(t * 2 + i) * 0.03
        o.mesh.scale.setScalar(s)
      })

      // Slowly rotate data rings independently
      dataRing.rotation.z += 0.0009
      dataRing2.rotation.z -= 0.0007

      // Drift particle field very slowly
      particles.rotation.y += 0.0004

      // Animate lights orbiting for shifting highlights
      keyLight.position.set(Math.sin(t * 0.35) * 4, Math.cos(t * 0.28) * 3, Math.cos(t * 0.35) * 4)
      rimLight.position.set(Math.sin(t * 0.22 + 3) * -4, Math.sin(t * 0.3) * -3, Math.cos(t * 0.22 + 3) * -4)

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      // size is fixed via prop; nothing to do unless container changes
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      latticeGeo.dispose()
      particleGeo.dispose()
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [scores, size])

  return (
    <div style={{ position: 'relative', width: size, height: size, cursor: 'grab' }}>
      <div ref={mountRef} />
      <div ref={labelsRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {MODULE_LABELS.map((label, i) => {
          const pos = [
            { top: '6%', left: '50%', transform: 'translateX(-50%)' },
            { top: '50%', right: '4%', transform: 'translateY(-50%)' },
            { bottom: '6%', left: '50%', transform: 'translateX(-50%)' },
            { top: '50%', left: '4%', transform: 'translateY(-50%)' },
          ]
          const colors = ['#7c5cfc', '#1fd9a0', '#f9a825', '#f75c5c']
          const score = (scores && scores[MODULE_KEYS[i]]) || null
          return (
            <div key={label} style={{
              position: 'absolute', ...pos[i],
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              <div style={{
                fontSize: 10, fontWeight: 700, color: colors[i],
                letterSpacing: '0.08em', textTransform: 'uppercase',
                textShadow: `0 0 12px ${colors[i]}99`,
              }}>
                {label}
              </div>
              {score ? (
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: "'Space Grotesk',sans-serif" }}>
                  {score.toFixed(1)}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
