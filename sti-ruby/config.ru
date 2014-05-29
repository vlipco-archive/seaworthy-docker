app = proc do |env|
	date = File.read "date"
    [ 200, {'Content-Type' => 'text/plain'}, [date] ]
end

run app
