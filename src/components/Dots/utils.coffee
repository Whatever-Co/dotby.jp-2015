module.exports =
  rr: (n) -> (Math.random() - 0.5) * n
  rnr: (min, max) -> Math.random() * (max - min) + min
