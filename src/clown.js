import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit3, Zap, MessageSquare, CreditCard, X, Copy, RefreshCw } from "lucide-react";

/*********************************
 * 1) Minimal placeholders for Card, CardContent, Button
 *********************************/
export function Card({ children, className = "" }) {
  return <div className={`rounded-xl bg-[#111] p-2 shadow ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function Button({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 ${className}`}
    >
      {children}
    </button>
  );
}

/*********************************
 * 2) Main Landing Page Component
 *********************************/
export default function ManipulatorAiLandingPage() {
  const [showPromptPage, setShowPromptPage] = useState(false);
  const [toxicity, setToxicity] = useState(0);
  const [pastConversation, setPastConversation] = useState("");
  const [pastImages, setPastImages] = useState([]);
  const [details, setDetails] = useState("");

  // Loading and result states
  const [isLoading, setIsLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState("");

  // 1) Open the modal
  const handleOpenPrompt = () => {
    setShowPromptPage(true);
  };

  // 2) Close modal + reset data
  const handleClosePrompt = () => {
    setShowPromptPage(false);
    setPastConversation("");
    setDetails("");
    setToxicity(0);
    setPastImages([]);
    setIsLoading(false);
    setGeneratedText("");
  };

  // 3) Handle file uploads
  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setPastImages(filesArray);
    }
  };

  // 4) Send data to the server
  const handleGenerate = async () => {
    setGeneratedText("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("pastConversation", pastConversation);
      formData.append("details", details);
      formData.append("toxicity", toxicity.toString());
      pastImages.forEach((file, idx) => {
        formData.append(`image_${idx}`, file);
      });

      // For Vercel or other hosting:
      // create an /api/generate route, or change this fetch URL
      const response = await fetch("https://express-app-ckot.onrender.com/api/generate/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch from server");
      }
      const data = await response.json();
      setGeneratedText(data.manipulatedText || "Something went wrong.");
    } catch (err) {
      console.error(err);
      setGeneratedText("Oops! We couldn't generate your manipulative text this time.");
    } finally {
      setIsLoading(false);
    }
  };

  // 5) Copy to Clipboard
  const handleCopyGeneratedText = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    alert("Copied to clipboard!");
  };

  // 6) JSX Output (full version with all sections!)
  return (
    <div className="min-h-screen w-full bg-black text-gray-100 font-sans relative">
      {/* Prompt Page Modal */}
      {showPromptPage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1c1c1c] rounded-2xl w-full max-w-2xl p-6 relative shadow-2xl">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
              onClick={handleClosePrompt}
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Craft Your Next Message 😈</h2>
            <p className="text-gray-300 mb-6">
              Provide your past conversation (optional), any images, and details. Adjust the
              <span className="text-pink-500"> Toxicity</span> slider to control how strong you want
              your persuasion.
            </p>

            {/* Upload Images */}
            <div className="mb-4">
              <label className="block mb-2 text-gray-200 font-semibold">Upload Conversation Images</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="text-gray-200 focus:outline-none"
                accept="image/*"
              />
              {pastImages.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">Uploaded {pastImages.length} image(s)</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-200 font-semibold">Past Conversation</label>
              <textarea
                className="w-full p-2 rounded-md bg-[#2c2c2c] text-gray-100 focus:outline-none"
                rows={4}
                value={pastConversation}
                onChange={(e) => setPastConversation(e.target.value)}
                placeholder="Paste or type the previous conversation here..."
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-200 font-semibold">Message</label>
              <textarea
                className="w-full p-2 rounded-md bg-[#2c2c2c] text-gray-100 focus:outline-none"
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="What do you want to achieve? Provide context, desired tone, or outcome..."
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-gray-200 font-semibold">Toxicity Level</label>
              <input
                type="range"
                min="0"
                max="10"
                value={toxicity}
                onChange={(e) => setToxicity(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-right text-gray-300">
                Level: <span className="font-bold text-pink-500">{toxicity}</span> {toxicity > 7 ? "😈" : ""}
              </div>
            </div>

            {/* Loading + generate button */}
            {isLoading ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    className="h-full bg-pink-600 flex items-center justify-center"
                  >
                    <span className="ml-2">😈</span>
                  </motion.div>
                </div>
                <p className="text-pink-500 text-sm">Conjuring your manipulative text...</p>
              </div>
            ) : (
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-md w-full"
                onClick={handleGenerate}
              >
                Generate Manipulative Text
              </Button>
            )}

            {/* If there's a generated result, show it in iMessage style */}
            {generatedText && !isLoading && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-6 bg-[#0a0a0a] p-4 rounded-xl text-gray-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-white">Your Manipulative Message 😈</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCopyGeneratedText}
                      className="text-gray-300 hover:text-white p-1"
                      title="Copy"
                    >
                      <Copy size={20} />
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="text-gray-300 hover:text-white p-1"
                      title="Regenerate"
                    >
                      <RefreshCw size={20} />
                    </button>
                  </div>
                </div>
                <div className="max-w-full sm:max-w-md self-end px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-pink-600 text-white">
                  <p className="break-words">{generatedText}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center pt-12 pb-16 bg-gradient-to-r from-[#0a0a0a] to-[#1c1c1c]"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center text-blue-400">
          Manipulator.ai <span className="inline-block">😈</span>
        </h1>
        <p className="text-lg md:text-xl text-center text-gray-300 max-w-3xl">
          Harness the power of subtle persuasion in every text message. Let our AI rewrite your
          words to influence their emotions and outcomes—without them ever suspecting a thing.
        </p>
        <div className="mt-6">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-md"
            onClick={handleOpenPrompt}
          >
            Start Manipulating Now
          </Button>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="px-4 sm:px-8 py-12"
      >
        <h2 className="text-3xl font-bold text-blue-400 mb-6">Mind-Bending Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#111111] shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center">
              <Edit3 className="text-blue-400 mb-4" size={40} />
              <h3 className="text-xl font-semibold mb-2 text-white">Persuasive Rewrite</h3>
              <p className="text-sm text-gray-400 text-center">
                Transform mundane texts into psychologically impactful messages. Our AI ensures
                you say just the right thing.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center">
              <Zap className="text-blue-400 mb-4" size={40} />
              <h3 className="text-xl font-semibold mb-2 text-white">Instant Analysis</h3>
              <p className="text-sm text-gray-400 text-center">
                Get real-time feedback on tone, subtlety, and emotional triggers. Increase the odds
                of getting the reaction you want.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center">
              <MessageSquare className="text-blue-400 mb-4" size={40} />
              <h3 className="text-xl font-semibold mb-2 text-white">iMessage-Style Interface</h3>
              <p className="text-sm text-gray-400 text-center">
                See your manipulative masterpieces in a familiar chat bubble interface—perfect for
                texting on iOS.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Our Results Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="px-4 sm:px-8 py-12 bg-[#0f0f0f]"
      >
        <h2 className="text-3xl font-bold mb-6 text-blue-400">Our Results</h2>
        <p className="text-gray-300 mb-10 max-w-2xl">
          Curious about how well Manipulator.ai actually works? Here’s a glimpse at our performance.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-[#1a1a1a] shadow-lg rounded-2xl overflow-hidden flex flex-col items-center p-6">
            <h3 className="text-4xl font-bold text-blue-400 mb-2">354</h3>
            <p className="text-gray-300">Current Texts Generated</p>
          </Card>
          <Card className="bg-[#1a1a1a] shadow-lg rounded-2xl overflow-hidden flex flex-col items-center p-6">
            <h3 className="text-4xl font-bold text-blue-400 mb-2">87%</h3>
            <p className="text-gray-300">Success Rate</p>
          </Card>
          <Card className="bg-[#1a1a1a] shadow-lg rounded-2xl overflow-hidden flex flex-col items-center p-6">
            <h3 className="text-4xl font-bold text-blue-400 mb-2">100%</h3>
            <p className="text-gray-300">Manipulator</p>
          </Card>
        </div>
      </motion.section>

      {/* Examples / iMessage Mockup */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="px-4 sm:px-8 py-12 bg-[#0f0f0f]"
      >
        <h2 className="text-3xl font-bold mb-4 text-blue-400">See It in Action</h2>
        <p className="text-gray-400 max-w-3xl mb-8">
          Discover how a simple text can be transformed into a mind-shaping message that tilts
          conversations in your favor.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Original iMessage Conversation */}
          <Card className="bg-[#1a1a1a] shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold text-white mb-4">Original iMessage</h3>
              <div className="bg-[#0a0a0a] p-4 rounded-xl text-gray-200 flex flex-col space-y-3">
                {/* Other person's bubble */}
                <div className="max-w-xs self-start px-4 py-2 rounded-2xl bg-[#3a3a3a]">
                  <p>Hey, I was wondering if you could help me with something?</p>
                </div>
                {/* User's bubble */}
                <div className="max-w-xs self-end px-4 py-2 rounded-2xl bg-blue-700">
                  <p>Maybe we can chat later if you're free.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manipulator.ai iMessage Conversation */}
          <Card className="bg-[#1a1a1a] shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold text-white mb-4">Manipulator.ai iMessage 😈</h3>
              <div className="bg-[#0a0a0a] p-4 rounded-xl text-gray-200 flex flex-col space-y-3">
                {/* Other person's bubble */}
                <div className="max-w-xs self-start px-4 py-2 rounded-2xl bg-[#3a3a3a]">
                  <p>Hey, I was wondering if you could help me with something?</p>
                </div>
                {/* User's bubble */}
                <div className="max-w-xs self-end px-4 py-2 rounded-2xl bg-blue-600">
                  <p>Hey, I know you're the only one who can help me pull this off.</p>
                  <p>I can't stop thinking about your insight—when are you free to chat?</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Credits Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="px-4 sm:px-8 py-12"
      >
        <h2 className="text-3xl font-bold mb-6 text-blue-400">Buy Credits</h2>
        <p className="text-gray-300 mb-8 max-w-2xl">
          Each message transformation uses 1 credit. Choose the right credit pack for your
          manipulative needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#111111] shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Basic 5 Credits</h3>
              <p className="text-gray-400 text-sm mb-4">
                Perfect for testing out the waters. 5 manipulative transformations.
              </p>
              <span className="block text-2xl text-blue-400 font-bold mb-4">$2</span>
              <Button className="bg-blue-500 hover:bg-blue-600 w-full">
                <CreditCard className="mr-2" size={16} /> Purchase 5 Credits
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1b1b1b] shadow-lg rounded-2xl overflow-hidden border border-blue-500">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Power 50 Credits</h3>
              <p className="text-gray-400 text-sm mb-4">
                Get more out of every conversation with 50 transformations.
              </p>
              <span className="block text-2xl text-blue-400 font-bold mb-4">$5</span>
              <Button className="bg-blue-500 hover:bg-blue-600 w-full">
                <CreditCard className="mr-2" size={16} /> Purchase 50 Credits
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb=2">Ultimate 500 Credits</h3>
              <p className="text-gray-400 text-sm mb-4">
                For serious manipulators—never run out of transformations.
              </p>
              <span className="block text-2xl text-blue-400 font-bold mb-4">$25</span>
              <Button className="bg-blue-500 hover:bg-blue-600 w-full">
                <CreditCard className="mr-2" size={16} /> Purchase 500 Credits
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="px-4 sm:px-8 py-12 bg-[#0a0a0a] text-center"
      >
        <h2 className="text-3xl font-bold mb-4 text-blue-400">Ready to Influence Their Every Move?</h2>
        <p className="max-w-2xl mx-auto mb-6 text-gray-300">
          Step up your texting game with manipulative flair. Change their minds, hearts, and
          decisions—one message at a time.
        </p>
        <Button
          className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-2xl font-semibold shadow-md text-white"
          onClick={handleOpenPrompt}
        >
          Start Your First Rewrite
        </Button>
      </motion.section>

      {/* Footer */}
      <footer className="px-4 sm:px-8 py-6 bg-black border-t border-gray-800 text-sm text-gray-500 text-center">
        © {new Date().getFullYear()} Manipulator.ai | Unleash the Power of Persuasion.
      </footer>
    </div>
  );
}
