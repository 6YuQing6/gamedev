const BIO_TEXT =
  'Computer science: Game design (UCSC). Aspiring software developer, game jam enthusiast, digital art hobbyist.' + "\n" +
  '"By being unknowable the future remains makeable, and retains the possibility of change"';

const bio = document.getElementById('bio');
if (bio) {
  bio.textContent = BIO_TEXT; // textContent keeps it safe from HTML injection
}